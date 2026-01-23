
export enum EquipmentStatus {
  NORMAL = '正常',
  DAMAGED = '損壞',
  MISSING = '遺失',
  MAINTENANCE = '維修中'
}

export type EquipmentCategory = '相機組' | '腳架組' | '燈光組' | '收音組' | '線材組';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  subCategory?: string; // e.g. "鏡頭", "配件"
  quantity: number;
  unit: string;
  status: EquipmentStatus;
  remark: string;
  lastChecked?: string;
}

export interface Studio {
  id: string;
  name: string;
  description: string;
  equipment: Equipment[];
  icon: string;
}

export type ViewType = 'dashboard' | 'studioDetail' | 'categoryDetail';
