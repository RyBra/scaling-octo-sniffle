export const VOLUME_UNITS = ['м³', 'м²', 'шт', 'п.м.', 'т'] as const;
export type VolumeUnit = (typeof VOLUME_UNITS)[number];

export const EMPLOYEE_POSITIONS = ['бригадир', 'рабочий'] as const;
export type EmployeePosition = (typeof EMPLOYEE_POSITIONS)[number];

export interface ConstructionSiteDto {
  id: string;
  name: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConstructionSiteDto {
  name: string;
  address?: string;
}

export interface UpdateConstructionSiteDto {
  name?: string;
  address?: string | null;
}

export interface EmployeeDto {
  id: string;
  fullName: string;
  position: EmployeePosition;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  fullName: string;
  position: EmployeePosition;
  isActive?: boolean;
}

export interface UpdateEmployeeDto {
  fullName?: string;
  position?: EmployeePosition;
  isActive?: boolean;
}

export interface WorkTypeDto {
  id: string;
  name: string;
  code: string;
  defaultUnit: VolumeUnit | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkTypeDto {
  name: string;
  code: string;
  defaultUnit?: VolumeUnit;
  isActive?: boolean;
}

export interface UpdateWorkTypeDto {
  name?: string;
  code?: string;
  defaultUnit?: VolumeUnit | null;
  isActive?: boolean;
}

export interface JournalEntryDto {
  id: string;
  constructionSiteId: string;
  workDate: string;
  workTypeId: string;
  workTypeName: string;
  employeeId: string;
  employeeName: string;
  volume: number;
  unit: VolumeUnit;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntryDto {
  workDate: string;
  workTypeId: string;
  employeeId: string;
  volume: number;
  unit: VolumeUnit;
}

export interface UpdateJournalEntryDto {
  workDate?: string;
  workTypeId?: string;
  employeeId?: string;
  volume?: number;
  unit?: VolumeUnit;
}

export interface ListJournalEntriesQuery {
  dateFrom?: string;
  dateTo?: string;
  sort?: 'workDate:asc' | 'workDate:desc';
}
