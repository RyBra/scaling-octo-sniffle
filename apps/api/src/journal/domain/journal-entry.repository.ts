import { VolumeUnit } from '@construction-journal/shared';
import { JournalEntry } from './journal-entry.entity';

export interface ListEntriesFilter {
  constructionSiteId: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort?: 'workDate:asc' | 'workDate:desc';
}

export interface CreateEntryData {
  constructionSiteId: string;
  workDate: Date;
  workTypeId: string;
  employeeId: string;
  volume: number;
  unit: VolumeUnit;
}

export interface UpdateEntryData {
  workDate?: Date;
  workTypeId?: string;
  employeeId?: string;
  volume?: number;
  unit?: VolumeUnit;
}

export const JOURNAL_ENTRY_REPOSITORY = Symbol('JOURNAL_ENTRY_REPOSITORY');

export interface IJournalEntryRepository {
  findAll(filter: ListEntriesFilter): Promise<JournalEntry[]>;
  findById(constructionSiteId: string, id: string): Promise<JournalEntry | null>;
  create(data: CreateEntryData): Promise<JournalEntry>;
  update(constructionSiteId: string, id: string, data: UpdateEntryData): Promise<JournalEntry>;
  delete(constructionSiteId: string, id: string): Promise<void>;
}
