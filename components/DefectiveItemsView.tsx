import React, { useState, useRef } from 'react';
import { Studio, EquipmentStatus, Equipment, HistoryRecord, EquipmentUnit, EquipmentCategory } from '../types';
import { PERSONNEL_LIST } from '../constants';
import EquipmentRow from './EquipmentRow';

interface Props {
  studios: Studio[];
  history: HistoryRecord[];
  onBack: () => void;
  onSyncAllStudios: () => void;
  onUpdateEquipmentUnit: (studioId: string, eqId: string, unitIdx: number, updates: Partial<EquipmentUnit>, personnel?: string) => void;
  isLoading?: boolean;
}

const DefectiveItemsView: React.FC<Props> = ({ 
  studios, 
  history, 
  onBack, 
  onSyncAllStudios, 
  onUpdateEquipmentUnit,
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'away' | 'label' | 'history' | 'overview'>('pending');
  const [maintenancePersonnel, setMaintenancePersonnel] = useState<string>(PERSONNEL_LIST[0]);
  const overviewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categories: EquipmentCategory[] = ['相機組', '腳架組', '圖傳Monitor', '燈光組', '收音組', '線材電池組', '記憶卡'];

  const getStudiosWithStatus = (status: EquipmentStatus) => {
    return studios.map(studio => ({
      ...studio,
      filteredItems: studio.equipment.filter(eq => eq.units.some(u => u.status === status))
    })).filter(s => s.filteredItems.length > 0);
  };

  const studiosWithIssues = studios.map(studio => ({
    ...studio,
    defectiveItems: studio.equipment.filter(eq => 
      eq.units.some(u => u.status === EquipmentStatus.DAMAGED || u.status === EquipmentStatus.MISSING)
    )
  })).filter(s => s.defectiveItems.length > 0);

  const studiosWithAwayItems = getStudiosWithStatus(EquipmentStatus.OUT_FOR_SHOOTING);
  const studiosWithLabelItems = getStudiosWithStatus(EquipmentStatus.LABEL_REPLACEMENT);

  const totalIssueCount = studiosWithIssues.reduce((acc, s) => acc + s.defectiveItems.reduce((eAcc, eq) => eAcc + eq.units.filter(u => u.status === EquipmentStatus.DAMAGED || u.status === EquipmentStatus.MISSING).length, 0), 0);
  const totalAwayCount = studiosWithAwayItems.reduce((acc, s) => acc + s.filteredItems.reduce((eAcc, eq) => eAcc + eq.units.filter(u => u.status === EquipmentStatus.OUT_FOR_SHOOTING).length, 0), 0);
  const totalLabelCount = studiosWithLabelItems.reduce((acc, s) => acc + s.filteredItems.reduce((eAcc, eq) => eAcc + eq.units.filter(u => u.status === EquipmentStatus.LABEL_REPLACEMENT).length, 0), 0);

  const scrollToStudio = (id: string) => overviewRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const getStatusSummary = (units: EquipmentUnit[]) => {
    const counts = units.reduce((acc, u) => {
      if (u.status === EquipmentStatus.NORMAL) acc.normal++;
      else if (u.status === EquipmentStatus.DAMAGED) acc.damaged++;
      else if (u.status === EquipmentStatus.MISSING) acc.missing++;
      else if (u.status === EquipmentStatus.OUT_FOR_SHOOTING) acc.away++;
      else if (u.status === EquipmentStatus.LABEL_REPLACEMENT) acc.label++;
      return acc;
    }, { normal: 0, damaged: 0, missing: 0, away: 0, label: 0 });
    return { ...counts, total: units.length };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7]">
      <div className="ios-blur sticky top-0 z-20 px-4 pt-10 pb-4 border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <button onClick={onBack} className="text-blue-500 p-1 active:opacity-50"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
          <h1 className="text-xl font-bold">資產維護中心</h1>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto no-scrollbar bg-gray-200/50 p-1 rounded-xl space-x-1 scroll-smooth">
            <button onClick={() => setActiveTab('pending')} className={`flex-none px-4 py-2 text-[10px] font-black rounded-lg transition-all ${activeTab === 'pending' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>待處理({totalIssueCount})</button>
            <button onClick={() => setActiveTab('away')} className={`flex-none px-4 py-2 text-[10px] font-black rounded-lg transition-all ${activeTab === 'away' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>外出({totalAwayCount})</button>
            <button onClick={() => setActiveTab('label')} className={`flex-none px-4 py-2 text-[10px] font-black rounded-lg transition-all ${activeTab === 'label' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>標籤更換({totalLabelCount})</button>
            <button onClick={() => setActiveTab('history')} className={`flex-none px-4 py-2 text-[10px] font-black rounded-lg transition-all ${activeTab === 'history' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>維修史</button>
            <button onClick={() => setActiveTab('overview')} className={`flex-none px-4 py-2 text-[10px] font-black rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>總數</button>
          </div>
          <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-gray-200/50 to-transparent pointer-events-none rounded-r-xl"></div>
        </div>
        <p className="text-[7px] text-gray-300 mt-1 text-center font-black tracking-widest uppercase">左右滑動切換分類</p>

        {(activeTab === 'pending' || activeTab === 'away' || activeTab === 'label') && (
          <div className="flex items-center justify-between px-1 mt-3 bg-white/50 p-2 rounded-xl border border-white/50">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">負責人:</span>
            <select value={maintenancePersonnel} onChange={(e) => setMaintenancePersonnel(e.target.value)} className="text-xs bg-transparent text-blue-600 font-black focus:outline-none">
              {PERSONNEL_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'label' && (
          studiosWithLabelItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400"><p className="text-lg font-bold">無待更換標籤</p></div>
          ) : (
            <div className="space-y-6">
              {studiosWithLabelItems.map((studio) => (
                <div key={studio.id} className="space-y-3">
                  <div className="flex items-center space-x-2 px-1"><span className="text-xl">{studio.icon}</span><h2 className="text-base font-black text-gray-800">{studio.name} 清單</h2></div>
                  {studio.filteredItems.map((item) => (
                    <div key={item.id} className="ios-card bg-white border border-indigo-100 overflow-hidden shadow-sm">
                      <div className="bg-indigo-50/50 px-3 py-2 flex justify-between items-center border-b border-indigo-50">
                        <span className="text-xs font-black text-indigo-700">{item.name}</span>
                      </div>
                      <div className="p-3 space-y-3">
                        {item.units.filter(u => u.status === EquipmentStatus.LABEL_REPLACEMENT).map(unit => (
                          <div key={unit.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-500">機台: <span className="text-indigo-600 text-sm font-black">{unit.unitLabel || `${unit.unitIndex}#`}</span></span>
                              <button onClick={() => onUpdateEquipmentUnit(studio.id, item.id, unit.unitIndex, { status: EquipmentStatus.NORMAL }, maintenancePersonnel)} className="text-[10px] bg-green-500 text-white px-3 py-1.5 rounded-xl font-black active:scale-95 shadow-md">完成更換</button>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                              <p className="text-[8px] font-black text-indigo-300 uppercase mb-1">標籤更換細節:</p>
                              <p className="text-xs text-gray-700 font-bold leading-relaxed">{unit.remark || '未填寫細節'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'pending' && (
          studiosWithIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400"><p className="text-lg font-bold">無異常項目</p></div>
          ) : (
            <div className="space-y-8">{studiosWithIssues.map((studio) => (
              <div key={studio.id} className="space-y-4">
                <div className="flex items-center space-x-2 px-1"><div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">{studio.icon}</div><h2 className="text-lg font-bold text-gray-800">{studio.name} 異常</h2></div>
                <div className="space-y-4">{studio.defectiveItems.map((item) => <EquipmentRow key={item.id} item={item} onUpdateUnit={(unitIdx, updates) => onUpdateEquipmentUnit(studio.id, item.id, unitIdx, updates, maintenancePersonnel)} />)}</div>
              </div>
            ))}</div>
          )
        )}

        {activeTab === 'away' && (
          studiosWithAwayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400"><p className="text-lg font-bold">目前無外出器材</p></div>
          ) : (
            <div className="space-y-8">{studiosWithAwayItems.map((studio) => (
              <div key={studio.id} className="space-y-4">
                <div className="flex items-center space-x-2 px-1"><div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">{studio.icon}</div><h2 className="text-lg font-bold text-gray-800">{studio.name} 外出</h2></div>
                <div className="space-y-4">{studio.filteredItems.map((item) => <EquipmentRow key={item.id} item={item} onUpdateUnit={(unitIdx, updates) => onUpdateEquipmentUnit(studio.id, item.id, unitIdx, updates, maintenancePersonnel)} />)}</div>
              </div>
            ))}</div>
          )
        )}

        {activeTab === 'history' && (
          history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400"><p className="text-lg font-bold">尚無維修紀錄</p></div>
          ) : (
            <div className="space-y-4">{history.map((record) => (
              <div key={record.id} className="ios-card p-4 border border-white">
                <div className="flex justify-between items-start mb-2"><div className="flex items-center space-x-2"><span className="text-lg">{record.studioIcon}</span><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{record.studioName}</span></div><span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500 text-white font-black uppercase shadow-sm">Fixed</span></div>
                <h4 className="font-bold text-gray-800">{record.equipmentName} - <span className="text-blue-600">{record.unitLabel || `${record.unitIndex}#`}</span></h4>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 p-2 rounded-xl"><p className="text-[9px] text-gray-400 uppercase font-black">原狀況</p><p className="text-xs text-red-500 font-bold">{record.previousStatus}</p></div>
                  <div className="bg-gray-50 p-2 rounded-xl border border-blue-50"><p className="text-[9px] text-gray-400 uppercase font-black">處理人</p><p className="text-xs text-blue-600 font-bold">{record.fixedBy}</p></div>
                  <div className="bg-gray-50 p-2 rounded-xl"><p className="text-[9px] text-gray-400 uppercase font-black">日期</p><p className="text-[10px] text-gray-600 font-bold">{new Date(record.fixedAt).toLocaleDateString()}</p></div>
                </div>
              </div>
            ))}</div>
          )
        )}

        {activeTab === 'overview' && (
          <div className="space-y-10 pb-20">
            <div className="px-1 mb-6"><h2 className="text-2xl font-black text-gray-900 leading-tight">全棚器材總數</h2><p className="text-xs text-gray-400 mt-1 font-bold">即時資產狀況摘要</p></div>
            {studios.map((studio) => (
              <div key={studio.id} ref={el => { overviewRefs.current[studio.id] = el; }} className="scroll-mt-36">
                <div className="flex items-center space-x-2 mb-3 px-1"><span className="text-xl">{studio.icon}</span><h2 className="text-lg font-bold text-gray-900">{studio.name} 統計</h2></div>
                <div className="ios-card overflow-hidden">
                  {categories.map((cat, catIdx) => {
                    const catItems = studio.equipment.filter(e => e.category === cat);
                    if (catItems.length === 0) return null;
                    return (
                      <div key={cat} className={catIdx !== 0 ? 'border-t border-gray-100' : ''}>
                        <div className="bg-gray-50/80 px-4 py-1.5 flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat}</span></div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="bg-white"><tr className="border-b border-gray-50"><th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase">品項</th><th className="px-2 py-2 text-[9px] font-black text-gray-400 uppercase text-center">異常</th><th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase text-right">數量</th></tr></thead>
                            <tbody>{catItems.map((item, itemIdx) => {
                              const stats = getStatusSummary(item.units);
                              const hasError = stats.damaged > 0 || stats.missing > 0 || stats.away > 0 || stats.label > 0;
                              return (
                                <tr key={item.id} className={itemIdx % 2 === 1 ? 'bg-gray-50/30' : 'bg-white'}>
                                  <td className="px-4 py-2.5"><p className="text-xs font-bold text-gray-800 leading-tight">{item.name}</p></td>
                                  <td className="px-2 py-2.5 text-center"><div className="flex justify-center items-center space-x-1">{stats.damaged > 0 && <div className="w-2 h-2 rounded-full bg-red-500"></div>}{stats.missing > 0 && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}{stats.away > 0 && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}{stats.label > 0 && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}{!hasError && <div className="w-2 h-2 rounded-full bg-green-500"></div>}</div></td>
                                  <td className="px-4 py-2.5 text-right font-mono"><span className={`text-xs font-black ${hasError ? 'text-blue-600' : 'text-green-600'}`}>{stats.normal}</span><span className="text-[10px] text-gray-300 mx-1">/</span><span className="text-xs text-gray-400 font-bold">{stats.total}</span></td>
                                </tr>
                              );
                            })}</tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* 關鍵同步按鈕 */}
            <div className="px-2 mt-12 pb-10">
              <div className="ios-card p-6 bg-white border border-red-100 shadow-xl shadow-red-50/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-red-50 p-2 rounded-xl"><svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
                  <div><h3 className="font-bold text-gray-900">同步器材標籤至 Cloud</h3><p className="text-[10px] text-gray-400 font-medium">適用於當您在後台代碼更新了器材清單時。</p></div>
                </div>
                <button disabled={isLoading} onClick={onSyncAllStudios} className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-red-500'} text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 ios-tap flex items-center justify-center space-x-2`}>
                  {isLoading ? <span>同步中...</span> : <span>一鍵同步所有棚器材標籤</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 mb-4"><button onClick={onBack} className="w-full bg-white text-gray-800 py-3 rounded-xl font-bold border border-gray-200 shadow-sm active:bg-gray-50 transition-colors">返回首頁</button></div>
    </div>
  );
};

export default DefectiveItemsView;