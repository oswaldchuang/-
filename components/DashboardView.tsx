
import React from 'react';
import { Studio, EquipmentStatus } from '../types.ts';

interface Props {
  studios: Studio[];
  onSelectStudio: (id: string) => void;
}

const DashboardView: React.FC<Props> = ({ studios, onSelectStudio }) => {
  return (
    <div className="flex-1 overflow-y-auto px-5 pt-12 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">器材清點</h1>
        <p className="text-gray-500 text-sm mt-1">更新於 {new Date().toLocaleDateString()}</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {studios.map(studio => {
          const total = studio.equipment.length;
          const issues = studio.equipment.filter(e => e.status !== EquipmentStatus.NORMAL).length;
          
          return (
            <div 
              key={studio.id}
              onClick={() => onSelectStudio(studio.id)}
              className="ios-card ios-tap p-4 flex items-center space-x-4 cursor-pointer"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">
                {studio.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800 leading-tight">{studio.name}</h2>
                <p className="text-sm text-gray-500 truncate w-48">{studio.description}</p>
                <div className="flex space-x-3 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {total} 項器材
                  </span>
                  {issues > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      {issues} 項異常
                    </span>
                  )}
                  {issues === 0 && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                      全部正常
                    </span>
                  )}
                </div>
              </div>
              <div className="text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 ios-card p-6 bg-blue-600 text-white">
        <h3 className="text-lg font-bold mb-1">今日統計</h3>
        <p className="opacity-90 text-sm mb-4">所有攝影棚狀態監控</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-xs opacity-70">器材總數</p>
            <p className="text-2xl font-bold">{studios.reduce((acc, s) => acc + s.equipment.length, 0)}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-xs opacity-70">需維護</p>
            <p className="text-2xl font-bold">{studios.reduce((acc, s) => acc + s.equipment.filter(e => e.status !== EquipmentStatus.NORMAL).length, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
