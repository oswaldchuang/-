import React, { useState, useEffect } from 'react';
import { Studio, EquipmentStatus, ViewType, HistoryRecord, EquipmentUnit, LabelStatus } from './types';
import { INITIAL_STUDIOS, PERSONNEL_LIST, generateEquipmentList } from './constants';
import DashboardView from './components/DashboardView';
import StudioDetailView from './components/StudioDetailView';
import DefectiveItemsView from './components/DefectiveItemsView';
import { db, sanitizeData } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  query, 
  orderBy, 
  writeBatch,
  deleteDoc
} from 'firebase/firestore';

const App: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [personnel, setPersonnel] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<string>('');
  
  // 自定義 UI 狀態
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 監聽器材資料：移除深層比對邏輯，防止 Circular Reference 報錯
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'equipments'), (snapshot) => {
      const studioData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Studio));
      // 僅排序，不進行 JSON Stringify 比對
      const sorted = [...studioData].sort((a, b) => a.id.localeCompare(b.id));
      setStudios(sorted);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Listen Error:", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 監聽維修歷史
  useEffect(() => {
    const q = query(collection(db, 'history'), orderBy('fixedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as HistoryRecord));
      setHistory(historyData);
    });
    return () => unsubscribe();
  }, []);

  // 監聽人員名單
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'personnel'), (snapshot) => {
      const names = snapshot.docs.map(doc => doc.data().name as string);
      setPersonnel(names);
    });
    return () => unsubscribe();
  }, []);

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

  // 一鍵同步邏輯 (僅由按鈕點擊觸發)
  const performSyncAction = async () => {
    setConfirmModal(null);
    setIsLoading(true);
    setSyncStatus('正在同步器材標籤...');

    try {
      const batch = writeBatch(db);
      const timestamp = new Date().toISOString();
      
      for (const targetDef of INITIAL_STUDIOS) {
        const studioNum = targetDef.id === 'studio-public' ? 0 : parseInt(targetDef.id.replace('studio-', ''));
        const prefix = targetDef.id === 'studio-public' ? 'sp' : `s${studioNum}`;
        const freshList = generateEquipmentList(prefix, studioNum);
        
        const existingStudio = studios.find(s => s.id === targetDef.id);
        
        let finalEquipment;
        if (targetDef.id === 'studio-public') {
          finalEquipment = freshList;
        } else {
          finalEquipment = freshList.map(freshItem => {
            const oldItem = existingStudio?.equipment.find(e => e.name === freshItem.name);
            if (oldItem) {
              const mergedUnits = freshItem.units.map((freshUnit, idx) => {
                const oldUnit = oldItem.units[idx];
                return {
                  ...freshUnit,
                  status: oldUnit?.status || EquipmentStatus.NORMAL,
                  remark: oldUnit?.remark || "",
                  lastChecked: oldUnit?.lastChecked || null,
                  lastCheckedBy: oldUnit?.lastCheckedBy || null,
                };
              });
              return { ...freshItem, units: mergedUnits };
            }
            return freshItem;
          });
        }

        const studioRef = doc(db, 'equipments', targetDef.id);
        const rawPayload = {
          ...targetDef,
          equipment: finalEquipment,
          lastSync: timestamp
        };

        batch.set(studioRef, sanitizeData(rawPayload, targetDef.id));
      }

      await batch.commit();
      showToast("✅ 器材標籤同步成功！", "success");
    } catch (error: any) {
      console.error('❌ 同步失敗:', error);
      showToast(`❌ 同步失敗: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
      setSyncStatus('');
    }
  };

  const handleSyncAllStudios = () => {
    setConfirmModal({
      message: "確定要同步器材標籤嗎？這將重新整理所有棚位的編號與清單，並保留現有的維護狀態。",
      onConfirm: performSyncAction
    });
  };

  const handleAddPersonnel = async (name: string) => {
    if (name && !personnel.includes(name)) {
      try {
        await setDoc(doc(db, 'personnel', name), sanitizeData({ name }));
        showToast(`已新增成員: ${name}`, "success");
      } catch (e) {
        showToast("新增失敗", "error");
      }
    }
  };

  const handleDeletePersonnel = async (name: string) => {
    setConfirmModal({
      message: `確定要刪除成員 ${name} 嗎？`,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await deleteDoc(doc(db, 'personnel', name));
          showToast(`已刪除成員: ${name}`, "info");
        } catch (e) {
          showToast("刪除失敗", "error");
        }
      }
    });
  };

  // 單機台更新邏輯
  const updateEquipmentUnit = async (studioId: string, equipmentId: string, unitIndex: number, updates: Partial<EquipmentUnit>, personnelName?: string) => {
    const studio = studios.find(s => s.id === studioId);
    if (!studio) return;

    const studioRef = doc(db, 'equipments', studioId);

    const updatedEquipment = studio.equipment.map(item => {
      if (item.id === equipmentId) {
        const updatedUnits = item.units.map(unit => {
          if (unit.unitIndex === unitIndex) {
            // 如果從異常恢復正常，寫入歷史紀錄
            if (updates.status === EquipmentStatus.NORMAL && unit.status !== EquipmentStatus.NORMAL) {
              const newRecord = sanitizeData({
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
              });
              addDoc(collection(db, 'history'), newRecord);
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

    try {
      // 寫入前強制執行 sanitizeData 以防 undefined 造成的錯誤
      await setDoc(studioRef, sanitizeData({ ...studio, equipment: updatedEquipment }));
    } catch (e: any) {
      console.error("更新機台失敗:", e);
      showToast(`更新失敗: ${e.message}`, "error");
    }
  };

  const selectedStudio = studios.find(s => s.id === selectedStudioId);

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col shadow-2xl bg-white overflow-hidden">
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

      {/* Toast 通知系統 */}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center space-x-2 border ${
            toast.type === 'success' ? 'bg-green-500/90 border-green-400' : 
            toast.type === 'error' ? 'bg-red-500/90 border-red-400' : 'bg-gray-800/90 border-gray-700'
          }`}>
            <span className="text-white text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 自定義確認彈窗 (取代原生 confirm) */}
      {confirmModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-xs overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">確認動作</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-4 text-blue-500 font-medium active:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                className="flex-1 py-4 text-red-500 font-bold border-l border-gray-100 active:bg-gray-50 transition-colors"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 全域 Loading 狀態 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999]">
          <div className="bg-white/90 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-gray-800">{syncStatus || '系統讀取中...'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;