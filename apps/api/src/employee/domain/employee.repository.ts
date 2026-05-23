import { EmployeePosition } from '@construction-journal/shared';

export interface EmployeeRecord {
  id: string;
  fullName: string;
  position: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeData {
  fullName: string;
  position: EmployeePosition;
  isActive?: boolean;
}

export interface UpdateEmployeeData {
  fullName?: string;
  position?: EmployeePosition;
  isActive?: boolean;
}

export const EMPLOYEE_REPOSITORY = Symbol('EMPLOYEE_REPOSITORY');

export interface IEmployeeRepository {
  findAll(): Promise<EmployeeRecord[]>;
  findById(id: string): Promise<EmployeeRecord | null>;
  create(data: CreateEmployeeData): Promise<EmployeeRecord>;
  update(id: string, data: UpdateEmployeeData): Promise<EmployeeRecord>;
  delete(id: string): Promise<void>;
}
