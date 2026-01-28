import React, { useState, useEffect } from 'react';
import { Studio, EquipmentStatus, ViewType, HistoryRecord, EquipmentUnit, LabelStatus } from './types';
import { INITIAL_STUDIOS, PERSONNEL_LIST, generateEquipmentList } from './constants';
import DashboardView from './components/DashboardView';
import StudioDetailView from './components/StudioDetailView';
import DefectiveItemsView from './components/DefectiveItemsView';
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  query, 
  orderBy, 
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

/**
 * 終極資料淨化函式
 * 遞歸刪除所有 undefined 和 null，確保 Firebase 接受資料
 */
const cleanData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(v => cleanData(v)).filter(v => v !== undefined);
  } else if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, cleanData(v)])
    );
  }
  return data;
};

const App: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [personnel, setPersonnel] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'equipments'), (snapshot) => {
      if (snapshot.empty) {
        seedInitialData();
      } else {
        const studioData = snapshot.docs.map(doc => doc.data() as Studio);
        const sorted = [...studioData].sort((a, b) => a.id.localeCompare(b.id));
        setStudios(sorted);
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Firestore Listen Error:", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'history'), orderBy('fixedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as HistoryRecord));
      setHistory(historyData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'personnel'), (snapshot) => {
      if (!snapshot.empty || !isLoading) {
        const names = snapshot.docs.map(doc => doc.data().name as string);
        setPersonnel(names);
      } else if (snapshot.empty && !isLoading) {
        seedInitialPersonnel();
      }
    });
    return () => unsubscribe();
  }, [isLoading]);

  const seedInitialData = async () => {
    try {
      const batch = writeBatch(db);
      INITIAL_STUDIOS.forEach((studio) => {
        const studioRef = doc(db, 'equipments', studio.id);
        batch.set(studioRef, cleanData(studio));
      });
      await batch.commit();
    } catch (e) {
      console.error("Seed Data Error:", e);
    }
  };

  const seedInitialPersonnel = async () => {
    try {
      const batch = writeBatch(db);
      PERSONNEL_LIST.forEach((name) => {
        const pRef = doc(db, 'personnel', name);
        batch.set(pRef, { name });
      });
      await batch.commit();
    } catch (e) {
      console.error("Seed Personnel Error:", e);
    }
  };

  const handleSelectStudio = (id: string) => {
    setSelectedStudioId(id);
    setCurrentView('studioDetail');
  };

  const handleShowDefective = () => {
    setCurrentView('defectiveItems');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedStudioId(null);
  };

  /**
   * 強化版一鍵同步 (極致 Debug)
   * 增加 Try-Catch, Loading 鎖定, 與資料深度淨化
   */
  const handleSyncAllStudios = async () => {
    const confirmMsg = "【強制更新確認】\n這將把「公共區 14 項器材」強行寫入雲端資料庫。\n同步期間請勿關閉視窗，完成後請重新整理網頁。是否繼續？";
    if (!window.confirm(confirmMsg)) return;
    
    setIsLoading(true);
    setSyncStatus('正在啟動 Debug 同步引擎...');

    try {
      const batch = writeBatch(db);
      const syncToken = `FORCE_SYNC_${Date.now()}`;
      console.log("🚀 開始同步任務 | Token:", syncToken);

      // 遍歷 INITIAL_STUDIOS，這是我們的結構準則
      for (const targetDef of INITIAL_STUDIOS) {
        setSyncStatus(`正在整理: ${targetDef.name} 器材清單...`);
        
        const existingData = studios.find(s => s.id === targetDef.id);
        const studioNum = targetDef.id === 'studio-public' ? 0 : parseInt(targetDef.id.replace('studio-', ''));
        const prefix = targetDef.id === 'studio-public' ? 'sp' : `s${studioNum}`;
        
        // 取得代碼中最新定義的器材結構
        const freshList = generateEquipmentList(prefix, studioNum);
        
        const mergedEquipment = freshList.map(freshItem => {
          // 嘗試在資料庫尋找匹配的項目 (按名稱或 ID)
          const oldItem = existingData?.equipment.find(e => 
            e.name === freshItem.name || e.id === freshItem.id
          );

          if (oldItem) {
            // 合併現有的「故障/遺失」等狀態
            const mergedUnits = freshItem.units.map((freshUnit, idx) => {
              const oldUnit = oldItem.units[idx];
              return {
                ...freshUnit, 
                status: oldUnit?.status || EquipmentStatus.NORMAL,
                remark: oldUnit?.remark || "",
                lastChecked: oldUnit?.lastChecked || undefined,
                lastCheckedBy: oldUnit?.lastCheckedBy || undefined,
                location: oldUnit?.location || undefined,
                labelStatus: freshUnit.unitLabel ? LabelStatus.LABELED : (oldUnit?.labelStatus || LabelStatus.UNLABELED)
              };
            });
            return { ...freshItem, units: mergedUnits };
          }
          // 如果是全新項目 (例如新增的 14 項電池)，直接使用 freshItem
          return freshItem;
        });

        const studioRef = doc(db, 'equipments', targetDef.id);
        const finalPayload = cleanData({
          ...targetDef,
          equipment: mergedEquipment,
          lastSync: new Date().toISOString(),
          _debugToken: syncToken
        });

        console.log(`📝 準備寫入棚位: ${targetDef.name}`, finalPayload);
        batch.set(studioRef, finalPayload);
      }

      setSyncStatus('正在將資料提交至雲端...');
      await batch.commit();
      
      console.log("✅ 雲端寫入成功！");
      alert("✅ 同步成功！\n\n公共區 14 項電池設備已全數掛載完畢。\n若畫面未出現，請【重新整理】網頁以清除快取。");
    } catch (error: any) {
      console.error("🔥 同步發生致命錯誤:", error);
      alert(`❌ 更新失敗！\n錯誤代碼: ${error.code || '未知'}\n錯誤訊息: ${error.message}\n\n請截圖控制台錯誤訊息並回報。`);
    } finally {
      setIsLoading(false);
      setSyncStatus('');
    }
  };

  const handleAddPersonnel = async (name: string) => {
    if (name && !personnel.includes(name)) {
      await setDoc(doc(db, 'personnel', name), { name });
    }
  };

  const handleDeletePersonnel = async (name: string) => {
    await deleteDoc(doc(db, 'personnel', name));
  };

  const updateEquipmentUnit = async (studioId: string, equipmentId: string, unitIndex: number, updates: Partial<EquipmentUnit>, personnelName?: string) => {
    const studio = studios.find(s => s.id === studioId);
    if (!studio) return;

    const studioRef = doc(db, 'equipments', studioId);

    const updatedEquipment = studio.equipment.map(item => {
      if (item.id === equipmentId) {
        const updatedUnits = item.units.map(unit => {
          if (unit.unitIndex === unitIndex) {
            if (updates.status === EquipmentStatus.NORMAL && unit.status !== EquipmentStatus.NORMAL) {
              const newRecord: Omit<HistoryRecord, 'id'> = {
                equipmentId: item.id,
                unitIndex: unit.unitIndex,
                unitLabel: unit.unitLabel || "",
                equipmentName: item.name,
                studioName: studio.name,
                studioIcon: studio.icon,
                fixedAt: new Date().toISOString(),
                fixedBy: personnelName || '未知人員',
                previousStatus: unit.status,
                remark: updates.remark || unit.remark || '無備註'
              };
              addDoc(collection(db, 'history'), cleanData(newRecord));
            }
            return { 
              ...unit, 
              ...updates, 
              lastChecked: new Date().toISOString(),
              lastCheckedBy: personnelName || unit.lastCheckedBy
            };
          }
          return unit;
        });
        return { ...item, units: updatedUnits };
      }
      return item;
    });

    await setDoc(studioRef, cleanData({ ...studio, equipment: updatedEquipment }));
  };

  const selectedStudio = studios.find(s => s.id === selectedStudioId);

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col shadow-2xl bg-white">
      {currentView === 'dashboard' && (
        <DashboardView 
          studios={studios} 
          onSelectStudio={handleSelectStudio} 
          onShowDefective={handleShowDefective} 
        />
      )}
      
      {currentView === 'studioDetail' && selectedStudio && (
        <StudioDetailView 
          studio={selectedStudio}
          personnel={personnel}
          onAddPersonnel={handleAddPersonnel}
          onDeletePersonnel={handleDeletePersonnel}
          onBack={handleBack}
          onUpdateEquipmentUnit={(eqId, unitIdx, updates, pName) => updateEquipmentUnit(selectedStudio.id, eqId, unitIdx, updates, pName)}
          onUpdateStudioInfo={() => {}}
        />
      )}

      {currentView === 'defectiveItems' && (
        <DefectiveItemsView 
          studios={studios}
          history={history}
          onBack={handleBack}
          onSyncAllStudios={handleSyncAllStudios}
          onUpdateEquipmentUnit={updateEquipmentUnit}
          isLoading={isLoading}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-2xl flex items-center justify-center z-[300] animate-in fade-in duration-300">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center max-w-[85%] border border-white/30">
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 border-[8px] border-blue-50 rounded-full"></div>
              <div className="absolute inset-0 border-[8px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 text-center mb-4 tracking-tighter">系統強制同步中</h3>
            <p className="text-sm text-gray-400 text-center px-6 leading-relaxed font-medium animate-pulse">
              {syncStatus || '正在向雲端寫入 14 項電池設備，請稍候...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;