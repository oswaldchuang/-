
import { Studio, EquipmentStatus, LabelStatus, Equipment } from './types.ts';

export const PERSONNEL_LIST = [
  'Oswald', 'Irene', 'Soda', 'Hana', 'Catherine', 
  'Yachi', 'Toy', 'Glen', 'Sophie', 'Unity'
];

const generateEquipmentList = (): Equipment[] => [
  // 相機組 - Updated as per user request
  { id: 'cam-1', name: 'A7s3', category: '相機組', quantity: 2, unit: '台', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'cam-2', name: 'Tamron 28-75', category: '相機組', quantity: 1, unit: '顆', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'cam-3', name: 'Tamron 70-180', category: '相機組', quantity: 1, unit: '顆', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'cam-4', name: '提把', category: '相機組', quantity: 2, unit: '個', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'cam-5', name: '怪手', category: '相機組', quantity: 2, unit: '個', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'cam-6', name: '底座（含15管）', category: '相機組', quantity: 2, unit: '個', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'cam-7', name: 'V掛背板', category: '相機組', quantity: 2, unit: '個', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  
  // 腳架組
  { id: 'tri-1', name: '蘋果箱', category: '腳架組', quantity: 1, unit: '個', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'tri-2', name: '專業油壓腳架 (標配)', category: '腳架組', quantity: 1, unit: '支', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  
  // 燈光組
  { id: 'lite-1', name: 'ARRI SkyPanel (標配)', category: '燈光組', quantity: 1, unit: '台', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'lite-2', name: 'C-Stand (標配)', category: '燈光組', quantity: 2, unit: '支', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },

  // 收音組
  { id: 'aud-1', name: '麥克風：sennheiser wireless G4', category: '收音組', quantity: 1, unit: '組', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'aud-2', name: '監聽耳機：SONY 7506', category: '收音組', quantity: 1, unit: '支', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  
  // 線材組
  { id: 'cab-1', name: '動力線', category: '線材組', quantity: 2, unit: '條', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'cab-2', name: '延長線', category: '線材組', quantity: 2, unit: '條', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
  { id: 'cab-3', name: 'Hdmi 線', category: '線材組', quantity: 4, unit: '條', status: EquipmentStatus.NORMAL, labelStatus: LabelStatus.UNLABELED, remark: '' },
];

export const INITIAL_STUDIOS: Studio[] = [
  { id: 'studio-1', name: '1號棚', description: '標準配備攝影棚', icon: '📸', equipment: generateEquipmentList() },
  { id: 'studio-2', name: '2號棚', description: '標準配備攝影棚', icon: '🎬', equipment: generateEquipmentList() },
  { id: 'studio-3', name: '3號棚', description: '標準配備攝影棚', icon: '🏠', equipment: generateEquipmentList() },
  { id: 'studio-4', name: '4號棚', description: '標準配備攝影棚', icon: '🌑', equipment: generateEquipmentList() },
  { id: 'studio-5', name: '5號棚', description: '標準配備攝影棚', icon: '🎙️', equipment: generateEquipmentList() },
  { id: 'studio-6', name: '6號棚', description: '標準配備攝影棚', icon: '🖥️', equipment: generateEquipmentList() }
];
