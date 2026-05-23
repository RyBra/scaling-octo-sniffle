import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CONSTRUCTION_SITE_REPOSITORY,
  IConstructionSiteRepository,
} from '../../construction-site/domain/construction-site.repository';
import {
  EMPLOYEE_REPOSITORY,
  IEmployeeRepository,
} from '../../employee/domain/employee.repository';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IWorkTypeRepository,
  WORK_TYPE_REPOSITORY,
} from '../../work-type/domain/work-type.repository';
import { JournalEntry } from '../domain/journal-entry.entity';
import {
  CreateEntryData,
  IJournalEntryRepository,
  ListEntriesFilter,
  UpdateEntryData,
} from '../domain/journal-entry.repository';
import { JournalMapper } from './journal.mapper';

const includeRelations = { workType: true, employee: true } as const;

@Injectable()
export class PrismaJournalRepository implements IJournalEntryRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CONSTRUCTION_SITE_REPOSITORY)
    private readonly siteRepository: IConstructionSiteRepository,
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
    @Inject(WORK_TYPE_REPOSITORY)
    private readonly workTypeRepository: IWorkTypeRepository,
  ) {}

  async findAll(filter: ListEntriesFilter): Promise<JournalEntry[]> {
    await this.ensureSiteExists(filter.constructionSiteId);

    const where: Prisma.JournalEntryWhereInput = {
      constructionSiteId: filter.constructionSiteId,
    };
    if (filter.dateFrom || filter.dateTo) {
      where.workDate = {};
      if (filter.dateFrom) where.workDate.gte = filter.dateFrom;
      if (filter.dateTo) where.workDate.lte = filter.dateTo;
    }

    const records = await this.prisma.journalEntry.findMany({
      where,
      orderBy: { workDate: filter.sort === 'workDate:asc' ? 'asc' : 'desc' },
      include: includeRelations,
    });

    return records.map(JournalMapper.toDomain);
  }

  async findById(constructionSiteId: string, id: string): Promise<JournalEntry | null> {
    const record = await this.prisma.journalEntry.findFirst({
      where: { id, constructionSiteId },
      include: includeRelations,
    });
    return record ? JournalMapper.toDomain(record) : null;
  }

  async create(data: CreateEntryData): Promise<JournalEntry> {
    await this.ensureSiteExists(data.constructionSiteId);
    const workType = await this.workTypeRepository.findById(data.workTypeId);
    if (!workType || !workType.isActive) {
      throw new NotFoundException('Вид работ не найден или деактивирован');
    }
    const employee = await this.employeeRepository.findById(data.employeeId);
    if (!employee || !employee.isActive) {
      throw new NotFoundException('Сотрудник не найден или деактивирован');
    }

    JournalEntry.create({
      constructionSiteId: data.constructionSiteId,
      workDate: data.workDate,
      workTypeId: data.workTypeId,
      workTypeName: workType.name,
      employeeId: data.employeeId,
      employeeName: employee.fullName,
      volume: data.volume,
      unit: data.unit,
    });

    const record = await this.prisma.journalEntry.create({
      data: {
        constructionSiteId: data.constructionSiteId,
        workDate: data.workDate,
        workTypeId: data.workTypeId,
        employeeId: data.employeeId,
        volume: data.volume,
        unit: data.unit,
      },
      include: includeRelations,
    });

    return JournalMapper.toDomain(record);
  }

  async update(
    constructionSiteId: string,
    id: string,
    data: UpdateEntryData,
  ): Promise<JournalEntry> {
    const existing = await this.findById(constructionSiteId, id);
    if (!existing) {
      throw new NotFoundException('Запись не найдена');
    }

    let workTypeName = existing.workTypeName;
    if (data.workTypeId) {
      const workType = await this.workTypeRepository.findById(data.workTypeId);
      if (!workType || !workType.isActive) {
        throw new NotFoundException('Вид работ не найден или деактивирован');
      }
      workTypeName = workType.name;
    }

    let employeeName = existing.employeeName;
    if (data.employeeId) {
      const employee = await this.employeeRepository.findById(data.employeeId);
      if (!employee || !employee.isActive) {
        throw new NotFoundException('Сотрудник не найден или деактивирован');
      }
      employeeName = employee.fullName;
    }

    JournalEntry.create({
      id: existing.id,
      constructionSiteId: existing.constructionSiteId,
      workDate: data.workDate ?? existing.workDate,
      workTypeId: data.workTypeId ?? existing.workTypeId,
      workTypeName,
      employeeId: data.employeeId ?? existing.employeeId,
      employeeName,
      volume: data.volume ?? existing.volume,
      unit: data.unit ?? existing.unit,
    });

    const record = await this.prisma.journalEntry.update({
      where: { id },
      data: {
        workDate: data.workDate,
        workTypeId: data.workTypeId,
        employeeId: data.employeeId,
        volume: data.volume,
        unit: data.unit,
      },
      include: includeRelations,
    });

    return JournalMapper.toDomain(record);
  }

  async delete(constructionSiteId: string, id: string): Promise<void> {
    const existing = await this.findById(constructionSiteId, id);
    if (!existing) {
      throw new NotFoundException('Запись не найдена');
    }
    await this.prisma.journalEntry.delete({ where: { id } });
  }

  private async ensureSiteExists(siteId: string): Promise<void> {
    const site = await this.siteRepository.findById(siteId);
    if (!site) {
      throw new BadRequestException('Строительный объект не найден');
    }
  }
}
