import { EMPLOYEE_POSITIONS } from '@construction-journal/shared';
import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsIn(EMPLOYEE_POSITIONS)
  position!: (typeof EMPLOYEE_POSITIONS)[number];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
