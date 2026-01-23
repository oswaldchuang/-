
import React, { useState } from 'react';
import { Studio, EquipmentStatus, Equipment, HistoryRecord } from '../types.ts';
import EquipmentRow from './EquipmentRow.tsx';

interface Props {
  studios: Studio[];
  history: HistoryRecord[];
  onBack: () => void;
  onUpdateEquipment: (studioId: string, eqId: string, updates: Partial<Equipment>) => void;
}

const DefectiveItemsView: React.FC<Props> = ({ studios, history, onBack, onUpdateEquipment }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  // Aggregate all defective items
  const allDefective = studios.flatMap(studio => 
    studio.equipment
      .filter(item => item.status !== EquipmentStatus.NORMAL)
      .map(item => ({ ...item, studioId: studio.id, studioName: studio.name, studioIcon: studio.icon }))
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7]">
      <div className="ios-blur sticky top-0 z-10 px-4 pt-10 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <button onClick={onBack} className="text-blue-500 ios-tap p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">維修管理</h1>
        </div>

        {/* iOS Segmented Control */}
        <div className="bg-gray-200/50 p-0.5 rounded-lg flex relative">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 z-10 ${activeTab === 'pending' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            待修狀況 ({allDefective.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 z-10 ${activeTab === 'history' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            歷史紀錄 ({history.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'pending' ? (
          allDefective.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                ✅
              </div>
              <p className="text-lg font-medium">目前沒有異常器材</p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xs text-gray-500 px-1">點擊項目可更新狀態，修正為「正常」後將歸入歷史紀錄。</p>
              {allDefective.map((item) => (
                <div key={`${item.studioId}-${item.id}`} className="space-y-1">
                  <div className="flex items-center space-x-2 px-1 mb-1">
                    <span className="text-sm">{item.studioIcon}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.studioName}</span>
                  </div>
                  <EquipmentRow 
                    item={item} 
                    onUpdate={(updates) => onUpdateEquipment(item.studioId, item.id, updates)} 
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          // History View
          history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                📜
              </div>
              <p className="text-lg font-medium">尚無維修紀錄</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div key={record.id} className="ios-card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{record.studioIcon}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{record.studioName}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">
                      已修復
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-gray-800">{record.equipmentName}</h4>
                  
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase font-bold">原狀態</p>
                      <p className="text-xs text-orange-600 font-medium">{record.previousStatus}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase font-bold">修復人</p>
                      <p className="text-xs text-blue-600 font-bold">{record.fixedBy}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase font-bold">修復日期</p>
                      <p className="text-xs text-gray-600 font-medium">{new Date(record.fixedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {record.remark && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg italic">
                      「{record.remark}」
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 text-[9px] text-gray-300 flex justify-between">
                    <span>記錄編號: {record.id}</span>
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
          className="w-full bg-white text-gray-800 py-3 rounded-xl font-bold border border-gray-200 ios-tap"
        >
          返回首頁
        </button>
      </div>
    </div>
  );
};

export default DefectiveItemsView;
