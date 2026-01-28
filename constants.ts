import { Studio, EquipmentStatus, LabelStatus, Equipment, EquipmentUnit } from './types.ts';

export const PERSONNEL_LIST = [
  'Oswald', 'Irene', 'Soda', 'Hana', 'Catherine', 
  'Yachi', 'Toy', 'Glen', 'Sophie', 'Unity'
];

const A7S3_LABELS: Record<number, string[]> = {
  1: ['1A-A7S3-01', '1A-A7S3-02'],
  2: ['2A-A7S3-03', '2A-A7S3-04'],
  3: ['3A-A7S3-05', '3A-A7S3-06'],
  4: ['4A-A7S3-07', '4A-A7S3-08'],
  6: ['6A-A7S3-09', '6A-A7S3-10'],
};

const TAMRON_2875_LABELS: Record<number, string[]> = {
  1: ['1A-28 75 -01'],
  2: ['2A-28 75 -02'],
  3: ['3A-28 75 -03'],
  4: ['4A-28 75 -04'],
  6: ['6A-28 75 -05'],
};

const TAMRON_70180_LABELS: Record<number, string[]> = {
  1: ['1A-70180-01'],
  2: ['2A-70180-02'],
  3: ['3A-70180-03'],
  4: ['4A-70180-04'],
  6: ['6A-70180-05'],
};

const HANDLE_LABELS: Record<number, string[]> = {
  1: ['1A-HANDLE-01', '1A-HANDLE-02'],
  2: ['2A-HANDLE-03', '2A-HANDLE-04'],
  3: ['3A-HANDLE-05', '3A-HANDLE-06'],
  4: ['4A-HANDLE-07', '4A-HANDLE-08'],
  6: ['6A-HANDLE-09', '6A-HANDLE-10'],
};

const ARM_LABELS: Record<number, string[]> = {
  1: ['1A-ARM-01', '1A-ARM-02'],
  2: ['2A-ARM-03', '2A-ARM-04'],
  3: ['3A-ARM-05', '3A-ARM-06'],
  4: ['4A-ARM-07', '4A-ARM-08'],
  6: ['6A-ARM-09', '6A-ARM-10'],
};

const BASE_LABELS: Record<number, string[]> = {
  1: ['1A-BASE-01', '1A-BASE-02'],
  2: ['2A-BASE-03', '2A-BASE-04'],
  3: ['3A-BASE-05', '3A-BASE-06'],
  4: ['4A-BASE-07', '4A-BASE08'],
  6: ['6A-BASE-09', '6A-BASE-10'],
};

const VPLATE_LABELS: Record<number, string[]> = {
  1: ['1A-PLATE-01', '1A-PLATE-02'],
  2: ['2A-PLATE-03', '2A-PLATE-04'],
  3: ['3A-PLATE-05', '3A-PLATE-06'],
  4: ['4A-PLATE-07', '4A-PLATE-08'],
  6: ['6A-PLATE-09', '6A-PLATE-10'],
};

const TERIS_LABELS: Record<number, string[]> = {
  1: ['1D-TERIS-01', '1D-TERIS-02'],
  2: ['2D-TERIS-03', '2D-TERIS-04'],
  3: ['3D-TERIS-05', '3D-TERIS-06'],
  4: ['4D-TERIS-07', '4D-TERIS-08'],
  6: ['6D-TERIS-09', '6D-TERIS-10'],
};

const KFOOT_LABELS: Record<number, string[]> = {
  1: ['1D-TRIPOD-01', '1D-TRIPOD-02', '1D-TRIPOD-03'],
  2: ['2D-TRIPOD-04', '2D-TRIPOD-05', '2D-TRIPOD-06'],
  3: ['3D-TRIPOD-07', '3D-TRIPOD-08', '3D-TRIPOD-09'],
  4: ['4D-TRIPOD-10', '4D-TRIPOD-11', '4D-TRIPOD-12'],
  6: ['6D-TRIPOD-13', '6D-TRIPOD-14', '6D-TRIPOD-15'],
};

const CSTAND_LABELS: Record<number, string[]> = {
  1: ['1D-C-Stand-01', '1D-C-Stand-02'],
  2: ['2D-C-Stand-03', '2D-C-Stand-04'],
  3: ['3D-C-Stand-05', '3D-C-Stand-06'],
  4: ['4D-C-Stand-07', '4D-C-Stand-08'],
  6: ['6D-C-Stand-09', '6D-C-Stand-10'],
};

const BOOM_LABELS: Record<number, string[]> = {
  1: ['1D-KCP-241-01', '1D-KCP-241-07'],
  2: ['2D-KCP-241-02', '2D-KCP-241-08'],
  3: ['3D-KCP-241-03', '3D-KCP-241-09'],
  4: ['4D-KCP-241-04', '4D-KCP-241-10'],
  6: ['6D-KCP-241-05', '6D-KCP-241-11'],
};

const GRIP_HEAD_LABELS: Record<number, string[]> = {
  1: ['1D-KCP-200-01', '1D-KCP-200-02', '1D-KCP-200-03'],
  2: ['2D-KCP-200-04', '2D-KCP-200-05', '2D-KCP-200-06'],
  3: ['3D-KCP-200-07', '3D-KCP-200-08', '3D-KCP-200-09'],
  4: ['4D-KCP-200-10', '4D-KCP-200-11', '4D-KCP-200-12'],
  6: ['6D-KCP-200-13', '6D-KCP-200-14', '6D-KCP-200-15'],
};

const KUPO_EXT_LABELS: Record<number, string[]> = {
  1: ['1D- KCP-640M-01'],
  2: ['2D- KCP-640M-02'],
  3: ['3D- KCP-640M-03'],
  4: ['4D- KCP-640M-04'],
  6: ['6D- KCP-640M-05'],
};

const VAXIS_LABELS: Record<number, string[]> = {
  1: ['1C-SMALLMO-01', '1C-SMALLMO-02'],
  2: ['2C-SMALLMO-03', '2C-SMALLMO-04'],
  3: ['3C-SMALLMO-05', '3C-SMALLMO-06'],
  4: ['4C-SMALLMO-07', '4C-SMALLMO-08'],
  6: ['6C-SMALLMO-09', '6C-SMALLMO-10'],
};

const SMALLHD_LABELS: Record<number, string[]> = {
  1: ['1C-BIGMO-01'],
  2: ['2C-BIGMO-02'],
  3: ['3C-BIGMO-02'],
  4: ['4C-BIGMO-04'],
  6: ['6C-BIGMO-05'],
};

const LITE_300D_LABELS: Record<number, string[]> = {
  1: ['1E-300dII-01'],
  2: ['2E-300dII-02'],
  3: ['3E-300dII-03'],
  4: ['4E-300dII-04'],
  5: ['5E-300dII-05'],
};

const LITE_200X_LABELS: Record<number, string[]> = {
  1: ['1E-200x-01', '1E-200x-02'],
  2: ['2E-200x-03', '2E-200x-04'],
  3: ['3E-200x-05', '3E-200x-06'],
  4: ['4E-200x-07', '4E-200x-08'],
  6: ['6E-200x-09', '6E-200x-10'],
};

const LITE_SPOT_LABELS: Record<number, string[]> = {
  1: ['1E-spotlight36°-01'],
  2: ['2E-spotlight36°-02'],
  3: ['3E-spotlight36°-03'],
  4: ['4E-spotlight36°-04'],
  6: ['6E-spotlight36°-05'],
};

const LITE_BIG_LABELS: Record<number, string[]> = {
  1: ['1E- BLightdome-01'],
  2: ['2E- BLightdome-02'],
  3: ['3E- BLightdome-03'],
  4: ['4E- BLightdome-04'],
  6: ['6E- BLlightdome-05'],
};

const LITE_SMALL_LABELS: Record<number, string[]> = {
  1: ['1E- SLightdome-01'],
  2: ['2E- SLightdome-02'],
  3: ['3E- SLightdome-03'],
  4: ['4E- SLightdome-04'],
  6: ['6E- SLlightdome-05'],
};

const LITE_REFL_LABELS: Record<number, string[]> = {
  1: ['1E-reflector-01'],
  2: ['2E-reflector-02'],
  3: ['3E- reflector-03'],
  4: ['4E-reflector-04'],
  6: ['6E-reflector-05'],
};

const createUnits = (baseId: string, quantity: number, specificLabels?: string[]): EquipmentUnit[] => {
  return Array.from({ length: quantity }, (_, i) => ({
    id: `${baseId}-unit-${i + 1}`,
    unitIndex: i + 1,
    unitLabel: specificLabels && specificLabels[i] ? specificLabels[i] : undefined,
    status: EquipmentStatus.NORMAL,
    labelStatus: specificLabels && specificLabels[i] ? LabelStatus.LABELED : LabelStatus.UNLABELED,
    remark: '',
  }));
};

const generateEquipmentList = (studioId: string, studioNum: number): Equipment[] => {
  const baseEquipment: Equipment[] = [
    // 相機組
    { 
      id: `${studioId}-cam-1`, 
      name: 'A7s3', 
      category: '相機組', 
      quantity: 2, 
      unit: '台', 
      units: createUnits(`${studioId}-cam-1`, 2, A7S3_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-cam-2`, 
      name: 'Tamron 28-75', 
      category: '相機組', 
      quantity: 1, 
      unit: '顆', 
      units: createUnits(`${studioId}-cam-2`, 1, TAMRON_2875_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-cam-3`, 
      name: 'Tamron 70-180', 
      category: '相機組', 
      quantity: 1, 
      unit: '顆', 
      units: createUnits(`${studioId}-cam-3`, 1, TAMRON_70180_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-cam-4`, 
      name: '提把', 
      category: '相機組', 
      quantity: 2, 
      unit: '個', 
      units: createUnits(`${studioId}-cam-4`, 2, HANDLE_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-cam-5`, 
      name: '怪手', 
      category: '相機組', 
      quantity: 2, 
      unit: '個', 
      units: createUnits(`${studioId}-cam-5`, 2, ARM_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-cam-6`, 
      name: '底座（含15管）', 
      category: '相機組', 
      quantity: 2, 
      unit: '個', 
      units: createUnits(`${studioId}-cam-6`, 2, BASE_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-cam-7`, 
      name: 'V掛背板', 
      category: '相機組', 
      quantity: 2, 
      unit: '個', 
      units: createUnits(`${studioId}-cam-7`, 2, VPLATE_LABELS[studioNum]) 
    },
    
    // 腳架組
    { 
      id: `${studioId}-tri-1`, 
      name: 'TERIS 圖瑞斯', 
      category: '腳架組', 
      quantity: 2, 
      unit: '支', 
      units: createUnits(`${studioId}-tri-1`, 2, TERIS_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-tri-2`, 
      name: 'K腳', 
      category: '腳架組', 
      quantity: 3, 
      unit: '支', 
      units: createUnits(`${studioId}-tri-2`, 3, KFOOT_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-tri-3`, 
      name: 'C-Stand', 
      category: '腳架組', 
      quantity: 2, 
      unit: '支', 
      units: createUnits(`${studioId}-tri-3`, 2, CSTAND_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-tri-4`, 
      name: '七號桿', 
      category: '腳架組', 
      quantity: 2, 
      unit: '支', 
      units: createUnits(`${studioId}-tri-4`, 2, BOOM_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-tri-5`, 
      name: '芭樂頭', 
      category: '腳架組', 
      quantity: 3, 
      unit: '個', 
      units: createUnits(`${studioId}-tri-5`, 3, GRIP_HEAD_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-tri-6`, 
      name: 'KUPO 鐵製延伸桿', 
      category: '腳架組', 
      quantity: 1, 
      unit: '支', 
      units: createUnits(`${studioId}-tri-6`, 1, KUPO_EXT_LABELS[studioNum]) 
    },
    
    // 圖傳Monitor
    { 
      id: `${studioId}-mon-vaxis`, 
      name: 'VAXIS ATOM', 
      category: '圖傳Monitor', 
      quantity: 2, 
      unit: '台', 
      units: createUnits(`${studioId}-mon-vaxis`, 2, VAXIS_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-mon-smallhd`, 
      name: 'SmallHD INDIE', 
      category: '圖傳Monitor', 
      quantity: 1, 
      unit: '台', 
      units: createUnits(`${studioId}-mon-smallhd`, 1, SMALLHD_LABELS[studioNum]) 
    },

    // 燈光組
    { 
      id: `${studioId}-lite-1`, 
      name: '300D', 
      category: '燈光組', 
      quantity: 1, 
      unit: '台', 
      units: createUnits(`${studioId}-lite-1`, 1, LITE_300D_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-lite-2`, 
      name: '200x', 
      category: '燈光組', 
      quantity: 2, 
      unit: '台', 
      units: createUnits(`${studioId}-lite-2`, 2, LITE_200X_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-lite-3`, 
      name: 'Spotlight', 
      category: '燈光組', 
      quantity: 1, 
      unit: '個', 
      units: createUnits(`${studioId}-lite-3`, 1, LITE_SPOT_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-lite-4`, 
      name: '大Lightdome', 
      category: '燈光組', 
      quantity: 1, 
      unit: '個', 
      units: createUnits(`${studioId}-lite-4`, 1, LITE_BIG_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-lite-5`, 
      name: '小Lightdome', 
      category: '燈光組', 
      quantity: 1, 
      unit: '個', 
      units: createUnits(`${studioId}-lite-5`, 1, LITE_SMALL_LABELS[studioNum]) 
    },
    { 
      id: `${studioId}-lite-6`, 
      name: '反光板', 
      category: '燈光組', 
      quantity: 1, 
      unit: '個', 
      units: createUnits(`${studioId}-lite-6`, 1, LITE_REFL_LABELS[studioNum]) 
    },
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

    { id: 'sp-tri-teris', name: 'TERIS 圖瑞斯', category: '腳架組', quantity: 5, unit: '支', units: createUnits('sp-tri-teris', 5) },
    { id: 'sp-tri-low', name: '圖瑞斯低角度腳架', category: '腳架組', quantity: 1, unit: '支', units: createUnits('sp-tri-low', 1) },
    { id: 'sp-tri-manfrotto', name: 'Manfrotto單腳架', category: '腳架組', quantity: 2, unit: '支', units: createUnits('sp-tri-manfrotto', 2) },
    { id: 'sp-tri-rs4', name: 'DJI RS4', category: '腳架組', quantity: 1, unit: '台', units: createUnits('sp-tri-rs4', 1) },
    { id: 'sp-tri-kfoot', name: 'K腳', category: '腳架組', quantity: 4, unit: '支', units: createUnits('sp-tri-kfoot', 4) },
    { id: 'sp-tri-cstand', name: 'C-Stand', category: '腳架組', quantity: 5, unit: '支', units: createUnits('sp-tri-cstand', 5) },
    { id: 'sp-tri-boom', name: '七號桿(含芭樂頭)', category: '腳架組', quantity: 3, unit: '支', units: createUnits('sp-tri-boom', 3) },
    { id: 'sp-tri-ext', name: 'KUPO 鐵製延伸桿', category: '腳架組', quantity: 1, unit: '支', units: createUnits('sp-tri-ext', 1) },
    { id: 'sp-tri-rod', name: 'KUPO窗簾桿', category: '腳架組', quantity: 2, unit: '支', units: createUnits('sp-tri-rod', 2) },
    { id: 'sp-tri-top', name: '頂機架', category: '腳架組', quantity: 4, unit: '個', units: createUnits('sp-tri-top', 4) },
    { id: 'sp-tri-cclamp', name: 'C型夾', category: '腳架組', quantity: 3, unit: '個', units: createUnits('sp-tri-cclamp', 3) },
    { id: 'sp-tri-mount', name: '螢幕固定架', category: '腳架組', quantity: 3, unit: '個', units: createUnits('sp-tri-mount', 3) },
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