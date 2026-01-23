
import React, { useState } from 'react';
import { Studio, EquipmentStatus, Equipment, HistoryRecord, EquipmentUnit } from '../types.ts';
import { PERSONNEL_LIST } from '../constants.ts';
import EquipmentRow from './EquipmentRow.tsx';

interface Props {
  studios: Studio[];
  history: HistoryRecord[];
  onBack: () => void;
  onUpdateEquipmentUnit: (studioId: string, eqId: string, unitIdx: number, updates: Partial<EquipmentUnit>, personnel?: string) => void;
}

const DefectiveItemsView: React.FC<Props> = ({ studios, history, onBack, onUpdateEquipmentUnit }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [maintenancePersonnel, setMaintenancePersonnel] = useState<string>(PERSONNEL_LIST[0]);

  // Grouping logic: Get studios and their specific defective equipment
  const studiosWithIssues = studios.map(studio => ({
    ...studio,
    defectiveItems: studio.equipment.filter(eq => eq.units.some(u => u.status !== EquipmentStatus.NORMAL))
  })).filter(s => s.defectiveItems.length > 0);

  const totalIssueCount = studiosWithIssues.reduce((acc, s) => {
    return acc + s.defectiveItems.reduce((eAcc, eq) => {
      const issues = eq.units.filter(u => u.status !== EquipmentStatus.NORMAL).length;
      return eAcc + issues;
    }, 0);
  }, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7]">
      <div className="ios-blur sticky top-0 z-10 px-4 pt-10 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <button onClick={onBack} className="text-blue-500 ios-tap p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">維修中心</h1>
        </div>

        <div className="bg-gray-200/50 p-0.5 rounded-lg flex relative mb-3">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 z-10 ${activeTab === 'pending' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            待處理 ({totalIssueCount})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 z-10 ${activeTab === 'history' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            已修復 ({history.length})
          </button>
        </div>

        {activeTab === 'pending' && totalIssueCount > 0 && (
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">當前維修人員:</span>
            <select 
              value={maintenancePersonnel}
              onChange={(e) => setMaintenancePersonnel(e.target.value)}
              className="text-xs bg-transparent text-blue-600 font-bold focus:outline-none"
            >
              {PERSONNEL_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'pending' ? (
          studiosWithIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">
                ✨
              </div>
              <p className="text-lg font-bold text-gray-600">一切正常！</p>
              <p className="text-xs mt-1">目前所有棚位器材均已歸位並運作正常</p>
            </div>
          ) : (
            <div className="space-y-8">
              {studiosWithIssues.map((studio) => (
                <div key={studio.id} className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">{studio.icon}</div>
                      <h2 className="text-lg font-bold text-gray-800">{studio.name}</h2>
                    </div>
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
        ) : (
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
                  
                  <h4 className="font-bold text-gray-800">{record.equipmentName} - <span className="text-blue-600">{record.unitIndex} 號機</span></h4>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] text-gray-400 uppercase font-black">損壞狀況</p>
                      <p className="text-xs text-red-500 font-bold">{record.previousStatus}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl border border-blue-50">
                      <p className="text-[9px] text-gray-400 uppercase font-black">維修人</p>
                      <p className="text-xs text-blue-600 font-bold">{record.fixedBy}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] text-gray-400 uppercase font-black">完成日期</p>
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
