import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateEmployeeData,
  EmployeeRecord,
  IEmployeeRepository,
  UpdateEmployeeData,
} from '../domain/employee.repository';

@Injectable()
export class PrismaEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<EmployeeRecord[]> {
    return this.prisma.employee.findMany({ orderBy: { fullName: 'asc' } });
  }

  findById(id: string): Promise<EmployeeRecord | null> {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  create(data: CreateEmployeeData): Promise<EmployeeRecord> {
    return this.prisma.employee.create({
      data: {
        fullName: data.fullName.trim(),
        position: data.position,
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(id: string, data: UpdateEmployeeData): Promise<EmployeeRecord> {
    try {
      return await this.prisma.employee.update({
        where: { id },
        data: {
          fullName: data.fullName?.trim(),
          position: data.position,
          isActive: data.isActive,
        },
      });
    } catch {
      throw new NotFoundException('Сотрудник не найден');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.employee.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Сотрудник не найден');
    }
  }
}
