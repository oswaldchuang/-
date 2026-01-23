
import React, { useState } from 'react';
import { Studio, Equipment, EquipmentStatus, EquipmentCategory } from '../types.ts';
import { PERSONNEL_LIST } from '../constants.ts';
import EquipmentRow from './EquipmentRow.tsx';

interface Props {
  studio: Studio;
  onBack: () => void;
  onUpdateEquipment: (id: string, updates: Partial<Equipment>, personnel?: string) => void;
}

const StudioDetailView: React.FC<Props> = ({ studio, onBack, onUpdateEquipment }) => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | null>(null);

  const categories: { name: EquipmentCategory, icon: string, color: string }[] = [
    { name: '相機組', icon: '📷', color: 'bg-blue-500' },
    { name: '腳架組', icon: '🔭', color: 'bg-orange-500' },
    { name: '燈光組', icon: '💡', color: 'bg-yellow-500' },
    { name: '收音組', icon: '🎙️', color: 'bg-purple-500' },
    { name: '線材組', icon: '🔌', color: 'bg-gray-600' },
  ];

  const getCategoryStats = (categoryName: EquipmentCategory) => {
    const items = studio.equipment.filter(e => e.category === categoryName);
    const issues = items.filter(e => e.status !== EquipmentStatus.NORMAL).length;
    const checked = items.filter(e => !!e.lastChecked).length;
    return { total: items.length, issues, checked };
  };

  const filteredEquipment = selectedCategory 
    ? studio.equipment.filter(e => e.category === selectedCategory)
    : [];

  // Step 1: Personnel Selection
  if (!selectedPersonnel) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#F2F2F7]">
        <div className="ios-blur sticky top-0 z-10 px-4 pt-10 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-blue-500 ios-tap">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">{studio.name} 人員確認</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-gray-500 mb-4 px-1">請選擇正在進行清點的人員：</p>
          <div className="ios-card overflow-hidden">
            {PERSONNEL_LIST.map((name, index) => (
              <div 
                key={name}
                onClick={() => setSelectedPersonnel(name)}
                className={`ios-tap p-4 flex items-center justify-between cursor-pointer active:bg-gray-100 transition-colors ${
                  index !== PERSONNEL_LIST.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="font-medium text-gray-800">{name}</span>
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Category List
  if (!selectedCategory) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="ios-blur sticky top-0 z-10 px-4 pt-10 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedPersonnel(null)} className="text-blue-500 ios-tap flex items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>切換人員</span>
            </button>
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-bold">{studio.name}</h1>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 rounded-full font-bold">
                {selectedPersonnel} 清點中
              </span>
            </div>
            <div className="w-12"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-sm text-gray-500 px-1">請選擇器材分類：</p>
          <div className="grid grid-cols-1 gap-3">
            {categories.map((cat) => {
              const stats = getCategoryStats(cat.name);
              return (
                <div 
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="ios-card ios-tap p-4 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${cat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-sm`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{cat.name}</h3>
                      <p className="text-xs text-gray-400">
                        {stats.checked}/{stats.total} 已檢查
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stats.issues > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {stats.issues} 異常
                      </span>
                    )}
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Specific Equipment List
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="ios-blur sticky top-0 z-10 px-4 pt-10 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedCategory(null)}
            className="flex items-center text-blue-500 ios-tap font-medium"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>分類</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold">{selectedCategory}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{studio.name}</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[9px] text-gray-400">清點人</span>
             <span className="text-xs font-bold">{selectedPersonnel}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filteredEquipment.map(item => (
          <EquipmentRow 
            key={item.id} 
            item={item} 
            onUpdate={(updates) => onUpdateEquipment(item.id, updates, selectedPersonnel!)} 
          />
        ))}
      </div>

      <div className="bg-white border-t border-gray-200 p-4 pb-12">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 ios-tap"
        >
          儲存並返回
        </button>
      </div>
    </div>
  );
};

export default StudioDetailView;
