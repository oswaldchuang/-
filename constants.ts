
import { Studio, EquipmentStatus, LabelStatus, Equipment, EquipmentUnit } from './types.ts';

export const PERSONNEL_LIST = [
  'Oswald', 'Irene', 'Soda', 'Hana', 'Catherine', 
  'Yachi', 'Toy', 'Glen', 'Sophie', 'Unity'
];

const createUnits = (baseId: string, quantity: number): EquipmentUnit[] => {
  return Array.from({ length: quantity }, (_, i) => ({
    id: `${baseId}-unit-${i + 1}`,
    unitIndex: i + 1,
    status: EquipmentStatus.NORMAL,
    labelStatus: LabelStatus.UNLABELED,
    remark: '',
  }));
};

const generateEquipmentList = (studioId: string, studioNum: number): Equipment[] => {
  const baseEquipment: Equipment[] = [
    // 相機組
    { id: `${studioId}-cam-1`, name: 'A7s3', category: '相機組', quantity: 2, unit: '台', units: createUnits(`${studioId}-cam-1`, 2) },
    { id: `${studioId}-cam-2`, name: 'Tamron 28-75', category: '相機組', quantity: 1, unit: '顆', units: createUnits(`${studioId}-cam-2`, 1) },
    { id: `${studioId}-cam-3`, name: 'Tamron 70-180', category: '相機組', quantity: 1, unit: '顆', units: createUnits(`${studioId}-cam-3`, 1) },
    { id: `${studioId}-cam-4`, name: '提把', category: '相機組', quantity: 2, unit: '個', units: createUnits(`${studioId}-cam-4`, 2) },
    { id: `${studioId}-cam-5`, name: '怪手', category: '相機組', quantity: 2, unit: '個', units: createUnits(`${studioId}-cam-5`, 2) },
    { id: `${studioId}-cam-6`, name: '底座（含15管）', category: '相機組', quantity: 2, unit: '個', units: createUnits(`${studioId}-cam-6`, 2) },
    { id: `${studioId}-cam-7`, name: 'V掛背板', category: '相機組', quantity: 2, unit: '個', units: createUnits(`${studioId}-cam-7`, 2) },
    
    // 腳架組
    { id: `${studioId}-tri-1`, name: 'TERIS 圖瑞斯', category: '腳架組', quantity: 2, unit: '支', units: createUnits(`${studioId}-tri-1`, 2) },
    { id: `${studioId}-tri-2`, name: 'K腳', category: '腳架組', quantity: 3, unit: '支', units: createUnits(`${studioId}-tri-2`, 3) },
    { id: `${studioId}-tri-3`, name: 'C-Stand', category: '腳架組', quantity: 2, unit: '支', units: createUnits(`${studioId}-tri-3`, 2) },
    { id: `${studioId}-tri-4`, name: '七號桿', category: '腳架組', quantity: 2, unit: '支', units: createUnits(`${studioId}-tri-4`, 2) },
    { id: `${studioId}-tri-5`, name: '芭樂頭', category: '腳架組', quantity: 3, unit: '個', units: createUnits(`${studioId}-tri-5`, 3) },
    { id: `${studioId}-tri-6`, name: 'KUPO 鐵製延伸桿', category: '腳架組', quantity: 1, unit: '支', units: createUnits(`${studioId}-tri-6`, 1) },
    
    // 圖傳Monitor
    { id: `${studioId}-mon-vaxis`, name: 'VAXIS ATOM', category: '圖傳Monitor', quantity: 2, unit: '台', units: createUnits(`${studioId}-mon-vaxis`, 2) },
    { id: `${studioId}-mon-smallhd`, name: 'SmallHD INDIE', category: '圖傳Monitor', quantity: 1, unit: '台', units: createUnits(`${studioId}-mon-smallhd`, 1) },

    // 燈光組
    { id: `${studioId}-lite-1`, name: '300D', category: '燈光組', quantity: 1, unit: '台', units: createUnits(`${studioId}-lite-1`, 1) },
    { id: `${studioId}-lite-2`, name: '200', category: '燈光組', quantity: 2, unit: '台', units: createUnits(`${studioId}-lite-2`, 2) },
    { id: `${studioId}-lite-3`, name: 'Spotlight', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-3`, 1) },
    { id: `${studioId}-lite-4`, name: '大Lightdome', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-4`, 1) },
    { id: `${studioId}-lite-5`, name: '小Lightdome', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-5`, 1) },
    { id: `${studioId}-lite-6`, name: '反光板', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-6`, 1) },
  ];

  if (studioNum === 1 || studioNum === 2) {
    baseEquipment.push({ 
      id: `${studioId}-lite-tube-pt2c`, 
      name: 'Amaran PT2c', 
      category: '燈光組', 
      quantity: 2, 
      unit: '支', 
      units: createUnits(`${studioId}-lite-tube-pt2c`, 2) 
    });
  } else if (studioNum === 3 || studioNum === 4 || studioNum === 6) {
    baseEquipment.push({ 
      id: `${studioId}-lite-tube-15c`, 
      name: 'PAVOTUBE 15C', 
      category: '燈光組', 
      quantity: 2, 
      unit: '支', 
      units: createUnits(`${studioId}-lite-tube-15c`, 2) 
    });
  }

  // 收音組
  baseEquipment.push(
    { id: `${studioId}-aud-1`, name: '麥克風：sennheiser G4', category: '收音組', quantity: 1, unit: '組', units: createUnits(`${studioId}-aud-1`, 1) },
    { id: `${studioId}-aud-2`, name: '監聽耳機：SONY 7506', category: '收音組', quantity: 1, unit: '支', units: createUnits(`${studioId}-aud-2`, 1) }
  );

  // 線材電池組
  baseEquipment.push(
    { id: `${studioId}-cab-applebox`, name: '蘋果箱', category: '線材電池組', quantity: 1, unit: '個', units: createUnits(`${studioId}-cab-applebox`, 1) },
    { id: `${studioId}-cab-power`, name: '動力線', category: '線材電池組', quantity: 2, unit: '條', units: createUnits(`${studioId}-cab-power`, 2) },
    { id: `${studioId}-cab-ext`, name: '延長線', category: '線材電池組', quantity: 2, unit: '條', units: createUnits(`${studioId}-cab-ext`, 2) },
    { id: `${studioId}-cab-hdmis`, name: 'Hdmi（短）', category: '線材電池組', quantity: 4, unit: '條', units: createUnits(`${studioId}-cab-hdmis`, 4) },
    { id: `${studioId}-cab-hdmil`, name: 'Hdmi（長）', category: '線材電池組', quantity: 2, unit: '條', units: createUnits(`${studioId}-cab-hdmil`, 2) }
  );

  return baseEquipment;
};

// 特定為公共區生成的器材清單
const generatePublicEquipment = (): Equipment[] => {
  return [
    { id: 'sp-cam-a7s3', name: 'A7s3', category: '相機組', quantity: 3, unit: '台', units: createUnits('sp-cam-a7s3', 3) },
    { id: 'sp-cam-fx3', name: 'FX3', category: '相機組', quantity: 2, unit: '台', units: createUnits('sp-cam-fx3', 2) },
    { id: 'sp-cam-a6400', name: 'A6400', category: '相機組', quantity: 2, unit: '台', units: createUnits('sp-cam-a6400', 2) },
    { id: 'sp-cam-t35150', name: 'Tamron 35-150', category: '相機組', quantity: 5, unit: '顆', units: createUnits('sp-cam-t35150', 5) },
    { id: 'sp-cam-adapter', name: '35-150轉接環', category: '相機組', quantity: 5, unit: '個', units: createUnits('sp-cam-adapter', 5) },
    { id: 'sp-cam-s18105', name: 'Sony 18-105', category: '相機組', quantity: 2, unit: '顆', units: createUnits('sp-cam-s18105', 2) },
    { id: 'sp-cam-s90', name: 'Sony SEL90M28G', category: '相機組', quantity: 1, unit: '顆', units: createUnits('sp-cam-s90', 1) },
    { id: 'sp-cam-handle', name: '相機提把', category: '相機組', quantity: 5, unit: '個', units: createUnits('sp-cam-handle', 5) },
    { id: 'sp-cam-arm', name: '怪手', category: '相機組', quantity: 5, unit: '個', units: createUnits('sp-cam-arm', 5) },
    { id: 'sp-cam-base', name: '底座（含15管）', category: '相機組', quantity: 5, unit: '個', units: createUnits('sp-cam-base', 5) },
    { id: 'sp-cam-vmount', name: 'V掛背板', category: '相機組', quantity: 2, unit: '個', units: createUnits('sp-cam-vmount', 2) },
  ];
};

export const INITIAL_STUDIOS: Studio[] = [
  { id: 'studio-1', name: '1號棚', description: '專業攝影棚', icon: '🟢', themeColor: 'green', equipment: generateEquipmentList('s1', 1) },
  { id: 'studio-2', name: '2號棚', description: '專業攝影棚', icon: '🩷', themeColor: 'pink', equipment: generateEquipmentList('s2', 2) },
  { id: 'studio-3', name: '3號棚', description: '專業攝影棚', icon: '🟠', themeColor: 'orange', equipment: generateEquipmentList('s3', 3) },
  { id: 'studio-4', name: '4號棚', description: '專業攝影棚', icon: '🔵', themeColor: 'blue', equipment: generateEquipmentList('s4', 4) },
  { id: 'studio-5', name: '5號棚', description: '專業攝影棚', icon: '🔘', themeColor: 'gray', equipment: generateEquipmentList('s5', 5) },
  { id: 'studio-6', name: '6號棚', description: '專業攝影棚', icon: '🔴', themeColor: 'red', equipment: generateEquipmentList('s6', 6) },
  { id: 'studio-public', name: '公共區', description: '共用設備存放區', icon: '🟣', themeColor: 'purple', equipment: generatePublicEquipment() }
];
