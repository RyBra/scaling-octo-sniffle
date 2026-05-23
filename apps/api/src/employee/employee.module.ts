import { Module } from '@nestjs/common';
import { EMPLOYEE_REPOSITORY } from './domain/employee.repository';
import { PrismaEmployeeRepository } from './infrastructure/prisma-employee.repository';
import { EmployeeController } from './presentation/employee.controller';

@Module({
  controllers: [EmployeeController],
  providers: [
    {
      provide: EMPLOYEE_REPOSITORY,
      useClass: PrismaEmployeeRepository,
    },
  ],
  exports: [EMPLOYEE_REPOSITORY],
})
export class EmployeeModule {}
