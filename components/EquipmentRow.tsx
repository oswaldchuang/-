
import React, { useState } from 'react';
import { Equipment, EquipmentStatus, LabelStatus, EquipmentUnit } from '../types.ts';

interface Props {
  item: Equipment;
  onUpdateUnit: (unitIdx: number, updates: Partial<EquipmentUnit>) => void;
}

const EquipmentRow: React.FC<Props> = ({ item, onUpdateUnit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  const activeUnit = item.units[activeUnitIndex];
  
  const checkedUnitsCount = item.units.filter(u => !!u.lastChecked).length;
  const isAllChecked = checkedUnitsCount === item.units.length;

  const getStatusColor = (status: EquipmentStatus) => {
    switch(status) {
      case EquipmentStatus.NORMAL: return 'bg-green-500';
      case EquipmentStatus.DAMAGED: return 'bg-red-500';
      case EquipmentStatus.MISSING: return 'bg-orange-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusBg = (status: EquipmentStatus) => {
    switch(status) {
      case EquipmentStatus.NORMAL: return 'bg-green-50 text-green-700';
      case EquipmentStatus.DAMAGED: return 'bg-red-50 text-red-700';
      case EquipmentStatus.MISSING: return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className={`ios-card overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500/20' : ''}`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-gray-900">{item.name}</h4>
            {isAllChecked && (
              <span className="bg-blue-100 text-blue-600 p-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.category}</span>
            <span className="text-[10px] text-gray-300">•</span>
            <span className={`text-[10px] font-bold ${isAllChecked ? 'text-green-600' : 'text-blue-500'}`}>
              已清點 {checkedUnitsCount} / {item.quantity}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Quick status dots for all units */}
          <div className="flex -space-x-1">
            {item.units.map(u => (
              <div key={u.id} className={`w-2 h-2 rounded-full border border-white ${u.lastChecked ? getStatusColor(u.status) : 'bg-gray-200'}`} />
            ))}
          </div>
          <svg 
            className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 bg-gray-50/30 border-t border-gray-50 animate-in slide-in-from-top-2">
          {/* Unit Segmented Control */}
          {item.quantity > 1 && (
            <div className="my-4 overflow-x-auto">
              <div className="flex p-1 bg-gray-200/50 rounded-xl space-x-1 min-w-max">
                {item.units.map((unit, idx) => (
                  <button
                    key={unit.id}
                    onClick={() => setActiveUnitIndex(idx)}
                    className={`relative py-2 px-4 text-xs font-bold rounded-lg transition-all ${
                      activeUnitIndex === idx 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {unit.unitIndex} 號機
                    {unit.lastChecked && (
                      <div className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${getStatusColor(unit.status)} shadow-sm`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Unit Specific Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-gray-400 uppercase">機台清點: 第 {activeUnitIndex + 1} 台</span>
              {activeUnit.lastChecked && (
                <span className="text-[9px] text-gray-400">最後清點: {activeUnit.lastCheckedBy}</span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 px-1">器材狀況</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(EquipmentStatus).map(status => (
                    <button
                      key={status}
                      onClick={() => onUpdateUnit(activeUnit.unitIndex, { status })}
                      className={`py-2.5 px-1 rounded-xl text-xs font-bold ios-tap transition-all border-2 ${
                        activeUnit.status === status 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                          : 'bg-white border-gray-100 text-gray-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 px-1">標籤狀態</label>
                  <div className="flex p-0.5 bg-gray-100 rounded-xl">
                    {Object.values(LabelStatus).map(lStatus => (
                      <button
                        key={lStatus}
                        onClick={() => onUpdateUnit(activeUnit.unitIndex, { labelStatus: lStatus })}
                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                          activeUnit.labelStatus === lStatus 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-400'
                        }`}
                      >
                        {lStatus}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                   <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 px-1">快捷切換</label>
                   <button 
                    disabled={activeUnitIndex === item.units.length - 1}
                    onClick={() => setActiveUnitIndex(activeUnitIndex + 1)}
                    className="w-full py-2 bg-gray-100 rounded-xl text-[10px] font-bold text-gray-500 disabled:opacity-30 ios-tap"
                   >
                     下一台 →
                   </button>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 px-1">異常備註</label>
                <textarea
                  className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm resize-none h-20 shadow-sm focus:border-blue-300 transition-colors"
                  placeholder="輸入此機台的特殊狀況..."
                  value={activeUnit.remark}
                  onChange={(e) => onUpdateUnit(activeUnit.unitIndex, { remark: e.target.value })}
                />
              </div>
            </div>
            
            {activeUnit.lastChecked && (
              <div className="flex justify-between items-center px-1 pt-2 border-t border-gray-50">
                 <span className="text-[9px] text-gray-300">ID: {activeUnit.id}</span>
                 <span className="text-[9px] text-gray-300 italic">{new Date(activeUnit.lastChecked).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentRow;
