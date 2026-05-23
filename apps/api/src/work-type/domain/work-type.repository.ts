import { VolumeUnit } from '@construction-journal/shared';

export interface WorkTypeRecord {
  id: string;
  name: string;
  code: string;
  defaultUnit: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkTypeData {
  name: string;
  code: string;
  defaultUnit?: VolumeUnit;
  isActive?: boolean;
}

export interface UpdateWorkTypeData {
  name?: string;
  code?: string;
  defaultUnit?: VolumeUnit | null;
  isActive?: boolean;
}

export const WORK_TYPE_REPOSITORY = Symbol('WORK_TYPE_REPOSITORY');

export interface IWorkTypeRepository {
  findAll(): Promise<WorkTypeRecord[]>;
  findById(id: string): Promise<WorkTypeRecord | null>;
  create(data: CreateWorkTypeData): Promise<WorkTypeRecord>;
  update(id: string, data: UpdateWorkTypeData): Promise<WorkTypeRecord>;
  delete(id: string): Promise<void>;
}
