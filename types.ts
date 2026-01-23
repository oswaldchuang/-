
export enum EquipmentStatus {
  NORMAL = '正常',
  DAMAGED = '損壞',
  MISSING = '遺失'
}

export enum LabelStatus {
  LABELED = '已貼',
  UNLABELED = '未貼'
}

export type EquipmentCategory = '相機組' | '腳架組' | '燈光組' | '收音組' | '線材組';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  subCategory?: string;
  quantity: number;
  unit: string;
  status: EquipmentStatus;
  labelStatus: LabelStatus;
  remark: string;
  lastChecked?: string;
  lastCheckedBy?: string; // New field
}

export interface HistoryRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  studioName: string;
  studioIcon: string;
  fixedAt: string;
  fixedBy: string; // New field
  previousStatus: EquipmentStatus;
  remark: string;
}

export interface Studio {
  id: string;
  name: string;
  description: string;
  equipment: Equipment[];
  icon: string;
}

export type ViewType = 'dashboard' | 'studioDetail' | 'defectiveItems';
