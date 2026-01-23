
import React, { useState, useEffect } from 'react';
import { Studio, EquipmentStatus, ViewType, HistoryRecord, Equipment } from './types.ts';
import { INITIAL_STUDIOS } from './constants.ts';
import DashboardView from './components/DashboardView.tsx';
import StudioDetailView from './components/StudioDetailView.tsx';
import DefectiveItemsView from './components/DefectiveItemsView.tsx';

const App: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);

  useEffect(() => {
    const savedStudios = localStorage.getItem('studio_inventory_data');
    const savedHistory = localStorage.getItem('studio_inventory_history');
    
    if (savedStudios) {
      setStudios(JSON.parse(savedStudios));
    } else {
      setStudios(INITIAL_STUDIOS);
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (studios.length > 0) {
      localStorage.setItem('studio_inventory_data', JSON.stringify(studios));
    }
  }, [studios]);

  useEffect(() => {
    localStorage.setItem('studio_inventory_history', JSON.stringify(history));
  }, [history]);

  const handleSelectStudio = (id: string) => {
    setSelectedStudioId(id);
    setCurrentView('studioDetail');
  };

  const handleShowDefective = () => {
    setCurrentView('defectiveItems');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedStudioId(null);
  };

  const updateEquipment = (studioId: string, equipmentId: string, updates: Partial<Equipment>, personnelName?: string) => {
    setStudios(prev => prev.map(studio => {
      if (studio.id === studioId) {
        return {
          ...studio,
          equipment: studio.equipment.map(item => {
            if (item.id === equipmentId) {
              // History logic
              if (updates.status === EquipmentStatus.NORMAL && item.status !== EquipmentStatus.NORMAL) {
                const newRecord: HistoryRecord = {
                  id: Date.now().toString(),
                  equipmentId: item.id,
                  equipmentName: item.name,
                  studioName: studio.name,
                  studioIcon: studio.icon,
                  fixedAt: new Date().toISOString(),
                  fixedBy: personnelName || '未知人員',
                  previousStatus: item.status,
                  remark: updates.remark || item.remark
                };
                setHistory(prevHist => [newRecord, ...prevHist]);
              }
              return { 
                ...item, 
                ...updates, 
                lastChecked: new Date().toISOString(),
                lastCheckedBy: personnelName || item.lastCheckedBy
              };
            }
            return item;
          })
        };
      }
      return studio;
    }));
  };

  const selectedStudio = studios.find(s => s.id === selectedStudioId);

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col shadow-2xl bg-[#F2F2F7]">
      {currentView === 'dashboard' && (
        <DashboardView 
          studios={studios} 
          onSelectStudio={handleSelectStudio} 
          onShowDefective={handleShowDefective}
        />
      )}
      
      {currentView === 'studioDetail' && selectedStudio && (
        <StudioDetailView 
          studio={selectedStudio} 
          onBack={handleBack} 
          onUpdateEquipment={(eqId, updates, personnel) => updateEquipment(selectedStudio.id, eqId, updates, personnel)}
        />
      )}

      {currentView === 'defectiveItems' && (
        <DefectiveItemsView 
          studios={studios} 
          history={history}
          onBack={handleBack} 
          onUpdateEquipment={(studioId, eqId, updates) => updateEquipment(studioId, eqId, updates)}
        />
      )}
      
      <div className="h-1.5 w-32 bg-gray-300 rounded-full mx-auto my-3 shrink-0"></div>
    </div>
  );
};

export default App;
