
import React, { useState } from 'react';
import { Equipment, EquipmentStatus } from '../types';

interface Props {
  item: Equipment;
  onUpdate: (updates: Partial<Equipment>) => void;
}

const EquipmentRow: React.FC<Props> = ({ item, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: EquipmentStatus) => {
    switch(status) {
      case EquipmentStatus.NORMAL: return 'bg-green-100 text-green-700';
      case EquipmentStatus.DAMAGED: return 'bg-red-100 text-red-700';
      case EquipmentStatus.MISSING: return 'bg-orange-100 text-orange-700';
      case EquipmentStatus.MAINTENANCE: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="ios-card overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-800">{item.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
            <span>{item.category}</span>
            <span>•</span>
            <span>數量: {item.quantity} {item.unit}</span>
          </div>
        </div>
        <div className="text-gray-400">
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-50 bg-gray-50/50">
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">更新狀態</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(EquipmentStatus).map(status => (
                <button
                  key={status}
                  onClick={() => onUpdate({ status })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ios-tap transition-colors ${
                    item.status === status 
                      ? 'bg-blue-600 text-white border-transparent' 
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">備註事項</label>
            <textarea
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm resize-none h-20 shadow-inner"
              placeholder="請輸入異常說明或器材狀況..."
              value={item.remark}
              onChange={(e) => onUpdate({ remark: e.target.value })}
            />
          </div>

          <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
            <span>ID: {item.id}</span>
            <span>上次清點: {item.lastChecked ? new Date(item.lastChecked).toLocaleString() : '尚未清點'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentRow;
