
import React, { useState } from 'react';
import { Studio, Equipment, EquipmentStatus, EquipmentCategory, EquipmentUnit } from '../types.ts';

interface Props {
  studio: Studio;
  personnel: string[];
  onAddPersonnel: (name: string) => void;
  onDeletePersonnel: (name: string) => void;
  onBack: () => void;
  onUpdateStudioInfo: (updates: Partial<{ name: string; icon: string; description: string }>) => void;
  onUpdateEquipmentUnit: (id: string, unitIdx: number, updates: Partial<any>, personnelName?: string) => void;
}

import EquipmentRow from './EquipmentRow.tsx';

const StudioDetailView: React.FC<Props> = ({ 
  studio, 
  personnel, 
  onAddPersonnel, 
  onDeletePersonnel, 
  onBack, 
  onUpdateEquipmentUnit 
}) => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | null>(null);
  const [isManagingPersonnel, setIsManagingPersonnel] = useState(false);
  const [newPersonnelName, setNewPersonnelName] = useState('');

  // Helper to get color classes based on themeColor
  const getColorClasses = (color: string) => {
    const mapping: Record<string, { bg: string, text: string, bar: string, lightBg: string, border: string }> = {
      green: { bg: 'bg-green-500', text: 'text-green-600', bar: 'bg-green-500', lightBg: 'bg-green-50', border: 'border-green-100' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-600', bar: 'bg-pink-500', lightBg: 'bg-pink-50', border: 'border-pink-100' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', bar: 'bg-orange-500', lightBg: 'bg-orange-50', border: 'border-orange-100' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', bar: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-100' },
      gray: { bg: 'bg-gray-500', text: 'text-gray-600', bar: 'bg-gray-500', lightBg: 'bg-gray-50', border: 'border-gray-100' },
      red: { bg: 'bg-red-500', text: 'text-red-600', bar: 'bg-red-500', lightBg: 'bg-red-50', border: 'border-red-100' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', bar: 'bg-purple-500', lightBg: 'bg-purple-50', border: 'border-purple-100' },
    };
    return mapping[color] || mapping['blue'];
  };

  const theme = getColorClasses(studio.themeColor);

  const categories: { name: EquipmentCategory, icon: string, color: string }[] = [
    { name: '相機組', icon: '📷', color: 'bg-blue-500' },
    { name: '腳架組', icon: '🔭', color: 'bg-orange-500' },
    { name: '圖傳Monitor', icon: '📺', color: 'bg-green-600' },
    { name: '燈光組', icon: '💡', color: 'bg-yellow-500' },
    { name: '收音組', icon: '🎙️', color: 'bg-purple-500' },
    { name: '線材電池組', icon: '🔌🔋', color: 'bg-gray-600' },
  ];

  const getCategoryStats = (categoryName: EquipmentCategory) => {
    const items = studio.equipment.filter(e => e.category === categoryName);
    let totalUnits = 0;
    let checkedUnits = 0;
    let issues = 0;

    items.forEach(item => {
      totalUnits += item.units.length;
      item.units.forEach(u => {
        if (u.lastChecked) checkedUnits++;
        if (u.status !== EquipmentStatus.NORMAL) issues++;
      });
    });

    return { total: items.length, totalUnits, checkedUnits, issues };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonnelName.trim()) {
      onAddPersonnel(newPersonnelName.trim());
      setNewPersonnelName('');
    }
  };

  const filteredEquipment = selectedCategory 
    ? studio.equipment.filter(e => e.category === selectedCategory)
    : [];

  // Step 1: Personnel Selection & Management
  if (!selectedPersonnel) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#F2F2F7]">
        <div className="ios-blur sticky top-0 z-10 px-4 pt-10 pb-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className={`${theme.text} ios-tap`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">{isManagingPersonnel ? '管理名單' : `${studio.name} 人員確認`}</h1>
          </div>
          <button 
            onClick={() => setIsManagingPersonnel(!isManagingPersonnel)} 
            className={`${theme.text} font-bold text-sm ios-tap bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100`}
          >
            {isManagingPersonnel ? '完成' : '管理'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {!isManagingPersonnel && <p className="text-sm text-gray-500 mb-4 px-1">請選擇正在進行清點的人員：</p>}
          
          <div className="ios-card overflow-hidden">
            {personnel.map((name, index) => (
              <div 
                key={name}
                onClick={() => !isManagingPersonnel && setSelectedPersonnel(name)}
                className={`p-4 flex items-center justify-between transition-colors ${
                  !isManagingPersonnel ? 'ios-tap cursor-pointer active:bg-gray-50' : ''
                } ${index !== personnel.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  {isManagingPersonnel && (
                    <button 
                      onClick={() => onDeletePersonnel(name)}
                      className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white ios-tap"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                  )}
                  <span className="font-medium text-gray-800">{name}</span>
                </div>
                {!isManagingPersonnel && (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {isManagingPersonnel && (
            <form onSubmit={handleAddSubmit} className="mt-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 px-1">新增團隊成員</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newPersonnelName}
                  onChange={(e) => setNewPersonnelName(e.target.value)}
                  placeholder="輸入姓名..."
                  className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!newPersonnelName.trim()}
                  className="bg-blue-600 text-white px-5 rounded-xl font-bold text-sm ios-tap disabled:opacity-50"
                >
                  新增
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div className="p-4 opacity-50 text-center text-3xl pb-10">
          {studio.icon}
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
            <button onClick={() => setSelectedPersonnel(null)} className={`${theme.text} ios-tap flex items-center`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>換人</span>
            </button>
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-bold">{studio.name}</h1>
              <span className={`text-[9px] ${theme.lightBg} ${theme.text} px-2 rounded-full font-bold uppercase tracking-wider`}>
                {selectedPersonnel} 清點中
              </span>
            </div>
            <div className="p-2 text-2xl">
              {studio.icon}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {categories.map((cat) => {
              const stats = getCategoryStats(cat.name);
              const progress = stats.totalUnits > 0 ? (stats.checkedUnits / stats.totalUnits) * 100 : 0;
              
              return (
                <div 
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="ios-card ios-tap p-4 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className={`${cat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-sm`}>
                        {cat.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{cat.name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          {stats.total} 個品項 / {stats.totalUnits} 台機器
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {stats.issues > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                          {stats.issues} 異常
                        </span>
                      )}
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className={`h-1 w-full ${theme.lightBg} rounded-full overflow-hidden`}>
                    <div 
                      className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : theme.bg}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-gray-400 font-bold">清點進度</span>
                    <span className={`text-[9px] font-bold ${progress === 100 ? 'text-green-600' : theme.text}`}>{Math.round(progress)}%</span>
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
            className={`flex items-center ${theme.text} ios-tap font-medium`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回分類</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold">{selectedCategory}</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest">{studio.name}</span>
          </div>
          <div className="text-right">
             <span className={`text-[10px] ${theme.text} font-bold`}>{selectedPersonnel}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {filteredEquipment.map(item => (
          <EquipmentRow 
            key={item.id} 
            item={item} 
            onUpdateUnit={(unitIdx, updates) => onUpdateEquipmentUnit(item.id, unitIdx, updates, selectedPersonnel!)} 
          />
        ))}
      </div>

      <div className="bg-white border-t border-gray-200 p-4 pb-12">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`w-full ${theme.bg} text-white py-3 rounded-xl font-bold shadow-lg shadow-${studio.themeColor}-200 ios-tap`}
        >
          完成本類清點
        </button>
      </div>
    </div>
  );
};

export default StudioDetailView;
