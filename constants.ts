import { Studio, EquipmentStatus, LabelStatus, Equipment, EquipmentUnit } from './types';

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

const APPLEBOX_LABELS: Record<number, string[]> = {
  1: ['1B-Box-01'],
  2: ['2B-Box-02'],
  3: ['3B-Box-03'],
  4: ['4B-Box-04'],
  6: ['6B-Box-05'],
};

const SONY_7506_LABELS: Record<number, string[]> = {
  1: ['1C-SONY7506-01'],
  2: ['2C-SONY7506-02'],
  3: ['3C-SONY7506-03'],
  4: ['4C-SONY7506-04'],
  6: ['6C-SONY7506-05'],
};

const PAVOTUBE_15C_LABELS: Record<number, string[]> = {
  3: ['3E-pavotube-15C-01', '3E-pavotube-15C-02'],
  4: ['4E-pavotube-15C-03', '4E-pavotube-15C-04'],
  6: ['6E-pavotube-15C-05', '6E-pavotube-15C-06'],
};

const createUnits = (baseId: string, quantity: number, specificLabels?: string[]): EquipmentUnit[] => {
  return Array.from({ length: quantity }, (_, i) => {
    const label = (specificLabels && specificLabels[i]) ? specificLabels[i] : "";
    return {
      id: `${baseId}-unit-${i + 1}`,
      unitIndex: i + 1,
      unitLabel: label,
      status: EquipmentStatus.NORMAL,
      labelStatus: label ? LabelStatus.LABELED : LabelStatus.UNLABELED,
      remark: '',
    };
  });
};

export const generateEquipmentList = (studioId: string, studioNum: number): Equipment[] => {
  // 公共區專屬器材清單 (studioNum === 0) - 精確 14 項
  if (studioNum === 0) {
    const publicItems = [
      { name: 'A7S3原電', unit: '顆' },
      { name: 'FZ-100', unit: '顆' },
      { name: 'a6400電池', unit: '顆' },
      { name: '螢幕電池', unit: '顆' },
      { name: 'NP-F970', unit: '顆' },
      { name: '3號電池', unit: '組' },
      { name: 'V掛(99)', unit: '顆' },
      { name: 'V掛(135)', unit: '顆' },
      { name: 'V掛(140)', unit: '顆' },
      { name: 'a6400充電器', unit: '台' },
      { name: 'FZ-100充電器', unit: '台' },
      { name: 'V掛充電', unit: '組' },
      { name: '麥克風電池充電器', unit: '台' },
      { name: 'NP-F970 LCD 智能雙座充電', unit: '台' }
    ];

    return publicItems.map((item, idx) => ({
      id: `sp-v2-item-${idx + 1}`, // 使用 V2 ID 以防止與舊資料衝突
      name: item.name,
      category: '線材電池組',
      quantity: 1,
      unit: item.unit,
      units: createUnits(`sp-v2-item-${idx + 1}`, 1)
    }));
  }

  // 一般棚位器材
  const baseEquipment: Equipment[] = [
    { id: `${studioId}-cam-1`, name: 'A7s3', category: '相機組', quantity: 2, unit: '台', units: createUnits(`${studioId}-cam-1`, 2, A7S3_LABELS[studioNum]) },
    { id: `${studioId}-cam-2`, name: 'Tamron 28-75', category: '相機組', quantity: 1, unit: '顆', units: createUnits(`${studioId}-cam-2`, 1) },
    { id: `${studioId}-cam-3`, name: 'Tamron 70-180', category: '相機組', quantity: 1, unit: '顆', units: createUnits(`${studioId}-cam-3`, 1) },
    { id: `${studioId}-tri-1`, name: 'TERIS 圖瑞斯', category: '腳架組', quantity: 2, unit: '支', units: createUnits(`${studioId}-tri-1`, 2) },
    { id: `${studioId}-mon-smallhd`, name: 'SmallHD INDIE', category: '圖傳Monitor', quantity: 1, unit: '台', units: createUnits(`${studioId}-mon-smallhd`, 1) },
    { id: `${studioId}-lite-1`, name: '300D', category: '燈光組', quantity: 1, unit: '台', units: createUnits(`${studioId}-lite-1`, 1) },
  ];

  if (studioNum === 3 || studioNum === 4 || studioNum === 6) {
    baseEquipment.push({ id: `${studioId}-lite-tube-15c`, name: 'PAVOTUBE 15C', category: '燈光組', quantity: 2, unit: '支', units: createUnits(`${studioId}-lite-tube-15c`, 2, PAVOTUBE_15C_LABELS[studioNum]) });
  }

  baseEquipment.push({ id: `${studioId}-aud-2`, name: '監聽耳機：SONY 7506', category: '收音組', quantity: 1, unit: '支', units: createUnits(`${studioId}-aud-2`, 1, SONY_7506_LABELS[studioNum]) });
  baseEquipment.push({ id: `${studioId}-cab-applebox`, name: '蘋果箱', category: '線材電池組', quantity: 1, unit: '個', units: createUnits(`${studioId}-cab-applebox`, 1, APPLEBOX_LABELS[studioNum]) });

  return baseEquipment;
};

export const INITIAL_STUDIOS: Studio[] = [
  { id: 'studio-1', name: '1號棚', description: '專業攝影棚', icon: '🟢', themeColor: 'green', equipment: generateEquipmentList('s1', 1) },
  { id: 'studio-2', name: '2號棚', description: '專業攝影棚', icon: '🩷', themeColor: 'pink', equipment: generateEquipmentList('s2', 2) },
  { id: 'studio-3', name: '3號棚', description: '專業攝影棚', icon: '🟠', themeColor: 'orange', equipment: generateEquipmentList('s3', 3) },
  { id: 'studio-4', name: '4號棚', description: '專業攝影棚', icon: '🔵', themeColor: 'blue', equipment: generateEquipmentList('s4', 4) },
  { id: 'studio-5', name: '5號棚', description: '專業攝影棚', icon: '🔘', themeColor: 'gray', equipment: generateEquipmentList('s5', 5) },
  { id: 'studio-6', name: '6號棚', description: '專業攝影棚', icon: '🔴', themeColor: 'red', equipment: generateEquipmentList('s6', 6) },
  { id: 'studio-public', name: '公共區', description: '共用設備存放區', icon: '🟣', themeColor: 'purple', equipment: generateEquipmentList('sp', 0) }
];