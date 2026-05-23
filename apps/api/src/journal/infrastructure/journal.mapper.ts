import { VolumeUnit } from '@construction-journal/shared';
import {
  Employee,
  JournalEntry as PrismaJournalEntry,
  WorkType,
} from '@prisma/client';
import { JournalEntry } from '../domain/journal-entry.entity';

type PrismaEntryWithRelations = PrismaJournalEntry & {
  workType: WorkType;
  employee: Employee;
};

export class JournalMapper {
  static toDomain(record: PrismaEntryWithRelations): JournalEntry {
    return JournalEntry.reconstitute({
      id: record.id,
      constructionSiteId: record.constructionSiteId,
      workDate: record.workDate,
      workTypeId: record.workTypeId,
      workTypeName: record.workType.name,
      employeeId: record.employeeId,
      employeeName: record.employee.fullName,
      volume: Number(record.volume),
      unit: record.unit as VolumeUnit,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
