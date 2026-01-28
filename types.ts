
export enum EquipmentStatus {
  NORMAL = '正常',
  DAMAGED = '損壞',
  MISSING = '遺失',
  OUT_FOR_SHOOTING = '外出拍攝'
}

export enum LabelStatus {
  LABELED = '已貼',
  UNLABELED = '未貼'
}

export type EquipmentCategory = '相機組' | '腳架組' | '燈光組' | '收音組' | '線材電池組' | '圖傳Monitor';

export interface EquipmentUnit {
  id: string; // e.g., "cam-1-unit-1"
  unitIndex: number;
  unitLabel?: string; // New: Specific label for the unit (e.g., "1A-A7S3-01")
  status: EquipmentStatus;
  labelStatus: LabelStatus;
  remark: string;
  location?: string; 
  lastChecked?: string;
  lastCheckedBy?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  subCategory?: string;
  quantity: number;
  unit: string;
  units: EquipmentUnit[]; 
}

export interface HistoryRecord {
  id: string;
  equipmentId: string;
  unitIndex: number; 
  unitLabel?: string; // New: Label preserved in history
  equipmentName: string;
  studioName: string;
  studioIcon: string;
  fixedAt: string;
  fixedBy: string;
  previousStatus: EquipmentStatus;
  remark: string;
}

export interface Studio {
  id: string;
  name: string;
  description: string;
  equipment: Equipment[];
  icon: string;
  themeColor: string; 
}

export type ViewType = 'dashboard' | 'studioDetail' | 'defectiveItems';
