
import React, { useState } from 'react';
import { Studio, Equipment, EquipmentStatus, EquipmentCategory } from '../types.ts';
import EquipmentRow from './EquipmentRow.tsx';

interface Props {
  studio: Studio;
  onBack: () => void;
  onUpdateEquipment: (id: string, updates: Partial<Equipment>) => void;
}

const StudioDetailView: React.FC<Props> = ({ studio, onBack, onUpdateEquipment }) => {
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

  // View Category List
  if (!selectedCategory) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="ios-blur sticky top-0 z-10 px-4 pt-10 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-blue-500 ios-tap">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">{studio.name} 器材分類</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-sm text-gray-500 px-1">請選擇要清點的器材組別：</p>
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

  // View Specific Equipment in Category
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
          <div className="w-12"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filteredEquipment.map(item => (
          <EquipmentRow 
            key={item.id} 
            item={item} 
            onUpdate={(updates) => onUpdateEquipment(item.id, updates)} 
          />
        ))}
      </div>

      <div className="bg-white border-t border-gray-200 p-4 pb-12">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 ios-tap"
        >
          儲存並返回分類
        </button>
      </div>
    </div>
  );
};

export default StudioDetailView;
