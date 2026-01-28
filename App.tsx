
import React, { useState, useEffect } from 'react';
import { Studio, EquipmentStatus, ViewType, HistoryRecord, EquipmentUnit } from './types.ts';
import { INITIAL_STUDIOS, PERSONNEL_LIST } from './constants.ts';
import DashboardView from './components/DashboardView.tsx';
import StudioDetailView from './components/StudioDetailView.tsx';
import DefectiveItemsView from './components/DefectiveItemsView.tsx';
import { db } from './firebase.ts';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  query, 
  orderBy, 
  getDocs,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

/**
 * Recursively removes any keys with undefined values from an object.
 * Firestore does not support 'undefined'.
 */
const cleanData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(v => cleanData(v));
  } else if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, cleanData(v)])
    );
  }
  return data;
};

const App: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [personnel, setPersonnel] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Sync Studios from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'equipments'), (snapshot) => {
      if (snapshot.empty) {
        // Initial Seed
        seedInitialData();
      } else {
        const studioData = snapshot.docs.map(doc => doc.data() as Studio);
        // Sort by ID to keep order consistent
        const sorted = [...studioData].sort((a, b) => a.id.localeCompare(b.id));
        setStudios(sorted);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Sync History from Firestore
  useEffect(() => {
    const q = query(collection(db, 'history'), orderBy('fixedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as HistoryRecord));
      setHistory(historyData);
    });
    return () => unsubscribe();
  }, []);

  // 3. Sync Personnel from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'personnel'), (snapshot) => {
      if (snapshot.empty && !isLoading) {
        seedInitialPersonnel();
      } else {
        const names = snapshot.docs.map(doc => doc.data().name as string);
        setPersonnel(names);
      }
    });
    return () => unsubscribe();
  }, [isLoading]);

  const seedInitialData = async () => {
    console.log("Seeding initial equipment data to Firestore...");
    const batch = writeBatch(db);
    INITIAL_STUDIOS.forEach((studio) => {
      const studioRef = doc(db, 'equipments', studio.id);
      // Clean data before seeding
      batch.set(studioRef, cleanData(studio));
    });
    await batch.commit();
  };

  const seedInitialPersonnel = async () => {
    console.log("Seeding initial personnel data to Firestore...");
    const batch = writeBatch(db);
    PERSONNEL_LIST.forEach((name) => {
      const pRef = doc(db, 'personnel', name);
      batch.set(pRef, { name });
    });
    await batch.commit();
  };

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

  const updateStudioInfo = async (id: string, updates: Partial<{ name: string; icon: string; description: string }>) => {
    const studioRef = doc(db, 'equipments', id);
    const studio = studios.find(s => s.id === id);
    if (studio) {
      await setDoc(studioRef, cleanData({ ...studio, ...updates }));
    }
  };

  const handleAddPersonnel = async (name: string) => {
    if (name && !personnel.includes(name)) {
      await setDoc(doc(db, 'personnel', name), { name });
    }
  };

  const handleDeletePersonnel = async (name: string) => {
    await deleteDoc(doc(db, 'personnel', name));
  };

  const updateEquipmentUnit = async (studioId: string, equipmentId: string, unitIndex: number, updates: Partial<EquipmentUnit>, personnelName?: string) => {
    const studio = studios.find(s => s.id === studioId);
    if (!studio) return;

    const studioRef = doc(db, 'equipments', studioId);

    const updatedEquipment = studio.equipment.map(item => {
      if (item.id === equipmentId) {
        const updatedUnits = item.units.map(unit => {
          if (unit.unitIndex === unitIndex) {
            // History logic: transition to normal
            if (updates.status === EquipmentStatus.NORMAL && unit.status !== EquipmentStatus.NORMAL) {
              const newRecord: Omit<HistoryRecord, 'id'> = {
                equipmentId: item.id,
                unitIndex: unit.unitIndex,
                unitLabel: unit.unitLabel || "",
                equipmentName: item.name,
                studioName: studio.name,
                studioIcon: studio.icon,
                fixedAt: new Date().toISOString(),
                fixedBy: personnelName || '未知人員',
                previousStatus: unit.status,
                remark: updates.remark || unit.remark || '無備註'
              };
              addDoc(collection(db, 'history'), cleanData(newRecord));
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
    });

    await setDoc(studioRef, cleanData({ ...studio, equipment: updatedEquipment }));
  };

  const selectedStudio = studios.find(s => s.id === selectedStudioId);

  if (isLoading && studios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">同步中...</p>
        </div>
      </div>
    );
  }

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
