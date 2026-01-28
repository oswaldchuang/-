
import React, { useState, useRef } from 'react';
import { Studio, EquipmentStatus, Equipment, HistoryRecord, EquipmentUnit, EquipmentCategory } from '../types.ts';
import { PERSONNEL_LIST } from '../constants.ts';
import EquipmentRow from './EquipmentRow.tsx';

interface Props {
  studios: Studio[];
  history: HistoryRecord[];
  onBack: () => void;
  onUpdateEquipmentUnit: (studioId: string, eqId: string, unitIdx: number, updates: Partial<EquipmentUnit>, personnel?: string) => void;
}

const DefectiveItemsView: React.FC<Props> = ({ studios, history, onBack, onUpdateEquipmentUnit }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'away' | 'history' | 'overview'>('pending');
  const [maintenancePersonnel, setMaintenancePersonnel] = useState<string>(PERSONNEL_LIST[0]);
  const overviewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categories: EquipmentCategory[] = ['相機組', '腳架組', '圖傳Monitor', '燈光組', '收音組', '線材電池組'];

  // Logic: Filter studios that have Damaged or Missing items
  const studiosWithIssues = studios.map(studio => ({
    ...studio,
    defectiveItems: studio.equipment.filter(eq => 
      eq.units.some(u => u.status === EquipmentStatus.DAMAGED || u.status === EquipmentStatus.MISSING)
    )
  })).filter(s => s.defectiveItems.length > 0);

  // Logic: Filter studios that have items Out for Shooting
  const studiosWithAwayItems = studios.map(studio => ({
    ...studio,
    awayItems: studio.equipment.filter(eq => 
      eq.units.some(u => u.status === EquipmentStatus.OUT_FOR_SHOOTING)
    )
  })).filter(s => s.awayItems.length > 0);

  const totalIssueCount = studiosWithIssues.reduce((acc, s) => {
    return acc + s.defectiveItems.reduce((eAcc, eq) => {
      return eAcc + eq.units.filter(u => u.status === EquipmentStatus.DAMAGED || u.status === EquipmentStatus.MISSING).length;
    }, 0);
  }, 0);

  const totalAwayCount = studiosWithAwayItems.reduce((acc, s) => {
    return acc + s.awayItems.reduce((eAcc, eq) => {
      return eAcc + eq.units.filter(u => u.status === EquipmentStatus.OUT_FOR_SHOOTING).length;
    }, 0);
  }, 0);

  const scrollToStudio = (id: string) => {
    overviewRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getStatusSummary = (units: EquipmentUnit[]) => {
    const normal = units.filter(u => u.status === EquipmentStatus.NORMAL).length;
    const damaged = units.filter(u => u.status === EquipmentStatus.DAMAGED).length;
    const missing = units.filter(u => u.status === EquipmentStatus.MISSING).length;
    const away = units.filter(u => u.status === EquipmentStatus.OUT_FOR_SHOOTING).length;
    return { normal, damaged, missing, away, total: units.length };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7]">
      <div className="ios-blur sticky top-0 z-20 px-4 pt-10 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <button onClick={onBack} className="text-blue-500 ios-tap p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">資產維護中心</h1>
        </div>

        <div className="bg-gray-200/50 p-0.5 rounded-lg flex relative mb-3 overflow-hidden">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all duration-200 z-10 ${activeTab === 'pending' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            待處理 ({totalIssueCount})
          </button>
          <button 
            onClick={() => setActiveTab('away')}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all duration-200 z-10 ${activeTab === 'away' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            外出 ({totalAwayCount})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all duration-200 z-10 ${activeTab === 'history' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            已修復
          </button>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all duration-200 z-10 ${activeTab === 'overview' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            總覽
          </button>
        </div>

        {(activeTab === 'pending' || activeTab === 'away') && (totalIssueCount > 0 || totalAwayCount > 0) && (
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">當前負責人員:</span>
            <select 
              value={maintenancePersonnel}
              onChange={(e) => setMaintenancePersonnel(e.target.value)}
              className="text-xs bg-transparent text-blue-600 font-bold focus:outline-none"
            >
              {PERSONNEL_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
            {studios.map(s => (
              <button 
                key={s.id} 
                onClick={() => scrollToStudio(s.id)}
                className="shrink-0 text-[10px] font-bold px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 active:scale-95 transition-transform"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'pending' && (
          studiosWithIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">
                ✨
              </div>
              <p className="text-lg font-bold text-gray-600">目前無故障器材</p>
              <p className="text-xs mt-1">所有損壞與遺失項目均已處理完成</p>
            </div>
          ) : (
            <div className="space-y-8">
              {studiosWithIssues.map((studio) => (
                <div key={studio.id} className="space-y-4">
                  <div className="flex items-center space-x-2 px-1">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">{studio.icon}</div>
                    <h2 className="text-lg font-bold text-gray-800">{studio.name} 異常清單</h2>
                  </div>
                  <div className="space-y-4">
                    {studio.defectiveItems.map((item) => (
                      <EquipmentRow 
                        key={item.id} 
                        item={item} 
                        onUpdateUnit={(unitIdx, updates) => onUpdateEquipmentUnit(studio.id, item.id, unitIdx, updates, maintenancePersonnel)} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'away' && (
          studiosWithAwayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">
                🏠
              </div>
              <p className="text-lg font-bold text-gray-600">無外出器材</p>
              <p className="text-xs mt-1">目前所有器材皆存放在所屬棚位中</p>
            </div>
          ) : (
            <div className="space-y-8">
              {studiosWithAwayItems.map((studio) => (
                <div key={studio.id} className="space-y-4">
                  <div className="flex items-center space-x-2 px-1">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">{studio.icon}</div>
                    <h2 className="text-lg font-bold text-gray-800">{studio.name} 外出清單</h2>
                  </div>
                  <div className="space-y-4">
                    {studio.awayItems.map((item) => (
                      <EquipmentRow 
                        key={item.id} 
                        item={item} 
                        onUpdateUnit={(unitIdx, updates) => onUpdateEquipmentUnit(studio.id, item.id, unitIdx, updates, maintenancePersonnel)} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'history' && (
          history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">📜</div>
              <p className="text-lg font-bold">尚無維修紀錄</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div key={record.id} className="ios-card p-4 border border-white">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{record.studioIcon}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{record.studioName}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500 text-white font-black uppercase">Fixed</span>
                  </div>
                  <h4 className="font-bold text-gray-800">
                    {record.equipmentName} - <span className="text-blue-600">{record.unitLabel || `${record.unitIndex} 號機`}</span>
                  </h4>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] text-gray-400 uppercase font-black">原狀況</p>
                      <p className="text-xs text-red-500 font-bold">{record.previousStatus}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl border border-blue-50">
                      <p className="text-[9px] text-gray-400 uppercase font-black">處理人</p>
                      <p className="text-xs text-blue-600 font-bold">{record.fixedBy}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] text-gray-400 uppercase font-black">日期</p>
                      <p className="text-xs text-gray-600 font-bold">{new Date(record.fixedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {record.remark && (
                    <div className="mt-2 text-xs text-gray-500 bg-white/50 border border-gray-100 p-2 rounded-xl italic">
                      「{record.remark}」
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-50 text-[9px] text-gray-300 flex justify-between">
                    <span>#{record.id}</span>
                    <span>{new Date(record.fixedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'overview' && (
          <div className="space-y-10 pb-20">
            {studios.map((studio) => (
              <div 
                key={studio.id} 
                ref={el => { overviewRefs.current[studio.id] = el; }}
                className="scroll-mt-36"
              >
                <div className="flex items-center space-x-2 mb-3 px-1">
                  <span className="text-xl">{studio.icon}</span>
                  <h2 className="text-lg font-bold text-gray-900">{studio.name} 器材狀況表</h2>
                </div>

                <div className="ios-card overflow-hidden">
                  {categories.map((cat, catIdx) => {
                    const catItems = studio.equipment.filter(e => e.category === cat);
                    if (catItems.length === 0) return null;

                    return (
                      <div key={cat} className={catIdx !== 0 ? 'border-t border-gray-100' : ''}>
                        <div className="bg-gray-50/80 px-4 py-1.5 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat}</span>
                          <span className="text-[9px] font-bold text-gray-400">{catItems.length} 品項</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="bg-white">
                              <tr className="border-b border-gray-50">
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase">品項名稱</th>
                                <th className="px-2 py-2 text-[9px] font-bold text-gray-400 uppercase text-center">狀態</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase text-right">數量 (常/總)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {catItems.map((item, itemIdx) => {
                                const stats = getStatusSummary(item.units);
                                const hasError = stats.damaged > 0 || stats.missing > 0 || stats.away > 0;
                                const awayLabels = item.units.filter(u => u.status === EquipmentStatus.OUT_FOR_SHOOTING).map(u => u.unitLabel || `${u.unitIndex}#`);
                                const awayLocations = Array.from(new Set(item.units.filter(u => u.status === EquipmentStatus.OUT_FOR_SHOOTING && u.location).map(u => u.location)));

                                return (
                                  <tr key={item.id} className={itemIdx % 2 === 1 ? 'bg-gray-50/30' : 'bg-white'}>
                                    <td className="px-4 py-2.5">
                                      <div className="flex flex-col">
                                        <p className="text-xs font-bold text-gray-800 leading-tight">{item.name}</p>
                                        <div className="flex flex-wrap gap-1 mt-0.5">
                                          {awayLocations.map(l => (
                                            <span key={l} className="text-[8px] text-blue-500 font-bold bg-blue-50 px-1 rounded">@{l}</span>
                                          ))}
                                          {awayLabels.length > 0 && awayLabels.length < 3 && awayLabels.map(label => (
                                            <span key={label} className="text-[7px] text-gray-400 bg-gray-100 px-1 rounded">{label}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-2 py-2.5 text-center">
                                      <div className="flex justify-center items-center space-x-1">
                                        {stats.damaged > 0 && <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" title="損壞"></div>}
                                        {stats.missing > 0 && <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" title="遺失"></div>}
                                        {stats.away > 0 && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" title="外出"></div>}
                                        {!hasError && <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" title="正常"></div>}
                                      </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-mono">
                                      <span className={`text-xs font-bold ${hasError ? 'text-blue-600' : 'text-green-600'}`}>
                                        {stats.normal}
                                      </span>
                                      <span className="text-[10px] text-gray-300 mx-1">/</span>
                                      <span className="text-xs text-gray-400">{stats.total}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 mb-4">
        <button 
          onClick={onBack}
          className="w-full bg-white text-gray-800 py-3 rounded-xl font-bold border border-gray-200 shadow-sm ios-tap active:bg-gray-50"
        >
          返回首頁
        </button>
      </div>
    </div>
  );
};

export default DefectiveItemsView;
