import { JournalEntryDto } from '@construction-journal/shared';
import { JournalEntry } from '../domain/journal-entry.entity';

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export class JournalResponseMapper {
  static toDto(entry: JournalEntry): JournalEntryDto {
    return {
      id: entry.id,
      constructionSiteId: entry.constructionSiteId,
      workDate: formatDate(entry.workDate),
      workTypeId: entry.workTypeId,
      workTypeName: entry.workTypeName,
      employeeId: entry.employeeId,
      employeeName: entry.employeeName,
      volume: entry.volume,
      unit: entry.unit,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    };
  }
}
