import React from 'react';
import { Studio, EquipmentStatus } from '../types';

interface Props {
  studios: Studio[];
  onSelectStudio: (id: string) => void;
  onShowDefective: () => void;
}

const DashboardView: React.FC<Props> = ({ studios, onSelectStudio, onShowDefective }) => {
  const totalEquipmentCount = studios.reduce((acc, s) => acc + s.equipment.length, 0);
  const totalIssueCount = studios.reduce((acc, s) => {
    return acc + s.equipment.reduce((eAcc, eq) => {
      const hasIssue = eq.units.some(u => u.status !== EquipmentStatus.NORMAL);
      return eAcc + (hasIssue ? 1 : 0);
    }, 0);
  }, 0);

  const getColorClasses = (color: string) => {
    const mapping: Record<string, { bg: string, text: string, bar: string, lightBg: string }> = {
      green: { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500', lightBg: 'bg-green-100' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', bar: 'bg-pink-500', lightBg: 'bg-pink-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500', lightBg: 'bg-orange-100' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500', lightBg: 'bg-blue-100' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-600', bar: 'bg-gray-500', lightBg: 'bg-gray-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500', lightBg: 'bg-red-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500', lightBg: 'bg-purple-100' },
    };
    return mapping[color] || mapping['blue'];
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-12 pb-20">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">器材清點</h1>
          <p className="text-gray-500 text-sm mt-1">更新於 {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full border border-green-200">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-green-700 uppercase">Cloud</span>
          </div>
          {/* 極度顯眼的 v1.5 版本標記 */}
          <span className="text-[10px] font-black text-red-600 bg-yellow-300 px-2 py-1 rounded shadow-md border-2 border-red-500 uppercase animate-pulse">
            v1.5 - CORS RESET
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {studios.map(studio => {
          const colors = getColorClasses(studio.themeColor);
          const totalItems = studio.equipment.length;
          const itemsWithIssues = studio.equipment.filter(eq => eq.units.some(u => u.status !== EquipmentStatus.NORMAL)).length;
          
          let totalUnits = 0;
          let checkedUnits = 0;
          studio.equipment.forEach(eq => {
            totalUnits += eq.units.length;
            checkedUnits += eq.units.filter(u => !!u.lastChecked).length;
          });
          const progress = totalUnits > 0 ? (checkedUnits / totalUnits) * 100 : 0;
          const isComplete = progress === 100;

          return (
            <div key={studio.id} onClick={() => onSelectStudio(studio.id)} className="ios-card ios-tap p-4 cursor-pointer">
              <div className="flex items-center space-x-4 mb-3">
                <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white`}>{studio.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800 leading-tight">{studio.name}</h2>
                    {isComplete && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">已完成</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{studio.description}</p>
                  <div className="flex space-x-2 mt-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{totalItems} 品項 / {totalUnits} 機台</span>
                    {itemsWithIssues > 0 && <span className="text-[9px] font-bold text-red-500 uppercase">• {itemsWithIssues} 異常</span>}
                  </div>
                </div>
                <div className="text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">清點進度</span>
                  <span className={`text-[9px] font-bold ${isComplete ? 'text-green-600' : colors.text}`}>{Math.round(progress)}%</span>
                </div>
                <div className={`h-1.5 w-full ${colors.bg} rounded-full overflow-hidden shadow-inner`}>
                  <div className={`h-full transition-all duration-700 ease-out ${isComplete ? 'bg-green-500' : colors.bar}`} style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div onClick={onShowDefective} className="mt-8 ios-card p-6 bg-indigo-600 text-white ios-tap cursor-pointer relative overflow-hidden group shadow-xl shadow-indigo-100">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-active:scale-150 transition-transform"></div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">資產維護中心</h3>
            <p className="opacity-80 text-xs">追蹤所有異常機台與維修史</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-3 rounded-xl border border-white/5 backdrop-blur-sm"><p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">總品項數</p><p className="text-2xl font-bold">{totalEquipmentCount}</p></div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/5 backdrop-blur-sm"><p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">異常統計</p><p className="text-2xl font-bold text-white">{totalIssueCount}</p></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;