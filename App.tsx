
import React, { useState, useEffect } from 'react';
import { Studio, EquipmentStatus, ViewType, HistoryRecord, Equipment, EquipmentUnit } from './types.ts';
import { INITIAL_STUDIOS, PERSONNEL_LIST } from './constants.ts';
import DashboardView from './components/DashboardView.tsx';
import StudioDetailView from './components/StudioDetailView.tsx';
import DefectiveItemsView from './components/DefectiveItemsView.tsx';

const App: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [personnel, setPersonnel] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);

  useEffect(() => {
    const savedStudios = localStorage.getItem('studio_inventory_data');
    const savedHistory = localStorage.getItem('studio_inventory_history');
    const savedPersonnel = localStorage.getItem('studio_inventory_personnel');
    
    if (savedStudios) {
      setStudios(JSON.parse(savedStudios));
    } else {
      setStudios(INITIAL_STUDIOS);
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    if (savedPersonnel) {
      setPersonnel(JSON.parse(savedPersonnel));
    } else {
      setPersonnel(PERSONNEL_LIST);
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

  useEffect(() => {
    if (personnel.length > 0) {
      localStorage.setItem('studio_inventory_personnel', JSON.stringify(personnel));
    }
  }, [personnel]);

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

  const updateStudioInfo = (id: string, updates: Partial<{ name: string; icon: string; description: string }>) => {
    setStudios(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleAddPersonnel = (name: string) => {
    if (name && !personnel.includes(name)) {
      setPersonnel(prev => [...prev, name]);
    }
  };

  const handleDeletePersonnel = (name: string) => {
    setPersonnel(prev => prev.filter(p => p !== name));
  };

  const updateEquipmentUnit = (studioId: string, equipmentId: string, unitIndex: number, updates: Partial<EquipmentUnit>, personnelName?: string) => {
    setStudios(prev => prev.map(studio => {
      if (studio.id === studioId) {
        return {
          ...studio,
          equipment: studio.equipment.map(item => {
            if (item.id === equipmentId) {
              const updatedUnits = item.units.map(unit => {
                if (unit.unitIndex === unitIndex) {
                  // History logic: transition to normal
                  if (updates.status === EquipmentStatus.NORMAL && unit.status !== EquipmentStatus.NORMAL) {
                    const newRecord: HistoryRecord = {
                      id: Date.now().toString(),
                      equipmentId: item.id,
                      unitIndex: unit.unitIndex,
                      equipmentName: item.name,
                      studioName: studio.name,
                      studioIcon: studio.icon,
                      fixedAt: new Date().toISOString(),
                      fixedBy: personnelName || '未知人員',
                      previousStatus: unit.status,
                      remark: updates.remark || unit.remark
                    };
                    setHistory(prevHist => [newRecord, ...prevHist]);
                  }
                  return { 
                    ...unit, 
                    ...updates, 
                    lastChecked: new Date().toISOString(),
                    lastCheckedBy: personnelName || unit.lastCheckedBy
                  };
                }
                return unit;
              });
              return { ...item, units: updatedUnits };
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
          personnel={personnel}
          onAddPersonnel={handleAddPersonnel}
          onDeletePersonnel={handleDeletePersonnel}
          onBack={handleBack} 
          onUpdateStudioInfo={(updates) => updateStudioInfo(selectedStudio.id, updates)}
          onUpdateEquipmentUnit={(eqId, unitIdx, updates, personnelName) => updateEquipmentUnit(selectedStudio.id, eqId, unitIdx, updates, personnelName)}
        />
      )}

      {currentView === 'defectiveItems' && (
        <DefectiveItemsView 
          studios={studios} 
          history={history}
          onBack={handleBack} 
          onUpdateEquipmentUnit={updateEquipmentUnit}
        />
      )}
      
      <div className="h-1.5 w-32 bg-gray-300 rounded-full mx-auto my-3 shrink-0"></div>
    </div>
  );
};

export default App;
