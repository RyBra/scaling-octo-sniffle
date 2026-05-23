import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateWorkTypeData,
  IWorkTypeRepository,
  UpdateWorkTypeData,
  WorkTypeRecord,
} from '../domain/work-type.repository';

@Injectable()
export class PrismaWorkTypeRepository implements IWorkTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<WorkTypeRecord[]> {
    return this.prisma.workType.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string): Promise<WorkTypeRecord | null> {
    return this.prisma.workType.findUnique({ where: { id } });
  }

  async create(data: CreateWorkTypeData): Promise<WorkTypeRecord> {
    try {
      return await this.prisma.workType.create({
        data: {
          name: data.name.trim(),
          code: data.code.trim().toUpperCase(),
          defaultUnit: data.defaultUnit ?? null,
          isActive: data.isActive ?? true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Вид работ с таким именем или кодом уже существует');
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateWorkTypeData): Promise<WorkTypeRecord> {
    try {
      return await this.prisma.workType.update({
        where: { id },
        data: {
          name: data.name?.trim(),
          code: data.code?.trim().toUpperCase(),
          defaultUnit: data.defaultUnit === undefined ? undefined : data.defaultUnit,
          isActive: data.isActive,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Вид работ не найден');
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Вид работ с таким именем или кодом уже существует');
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.workType.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Вид работ не найден');
    }
  }
}
