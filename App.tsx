
import React, { useState, useEffect } from 'react';
import { Studio, EquipmentStatus } from './types.ts';
import { INITIAL_STUDIOS } from './constants.ts';
import DashboardView from './components/DashboardView.tsx';
import StudioDetailView from './components/StudioDetailView.tsx';

const App: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'studioDetail'>('dashboard');
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);

  // Initialize data from LocalStorage or Constants
  useEffect(() => {
    const saved = localStorage.getItem('studio_inventory_data');
    if (saved) {
      setStudios(JSON.parse(saved));
    } else {
      setStudios(INITIAL_STUDIOS);
    }
  }, []);

  // Save to LocalStorage whenever studios state changes
  useEffect(() => {
    if (studios.length > 0) {
      localStorage.setItem('studio_inventory_data', JSON.stringify(studios));
    }
  }, [studios]);

  const handleSelectStudio = (id: string) => {
    setSelectedStudioId(id);
    setCurrentView('studioDetail');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedStudioId(null);
  };

  const updateEquipment = (studioId: string, equipmentId: string, updates: Partial<any>) => {
    setStudios(prev => prev.map(studio => {
      if (studio.id === studioId) {
        return {
          ...studio,
          equipment: studio.equipment.map(item => {
            if (item.id === equipmentId) {
              return { ...item, ...updates, lastChecked: new Date().toISOString() };
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
      {currentView === 'dashboard' ? (
        <DashboardView studios={studios} onSelectStudio={handleSelectStudio} />
      ) : (
        selectedStudio && (
          <StudioDetailView 
            studio={selectedStudio} 
            onBack={handleBack} 
            onUpdateEquipment={(eqId, updates) => updateEquipment(selectedStudio.id, eqId, updates)}
          />
        )
      )}
      
      {/* iOS style indicator bar at bottom */}
      <div className="h-1.5 w-32 bg-gray-300 rounded-full mx-auto my-3 shrink-0"></div>
    </div>
  );
};

export default App;
