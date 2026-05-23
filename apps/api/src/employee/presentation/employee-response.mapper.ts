import { EmployeeDto, EmployeePosition } from '@construction-journal/shared';
import { EmployeeRecord } from '../domain/employee.repository';

export function toEmployeeDto(employee: EmployeeRecord): EmployeeDto {
  return {
    id: employee.id,
    fullName: employee.fullName,
    position: employee.position as EmployeePosition,
    isActive: employee.isActive,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}
