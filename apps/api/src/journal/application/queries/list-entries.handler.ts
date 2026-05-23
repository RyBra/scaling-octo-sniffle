import { Inject, Injectable } from '@nestjs/common';
import { JournalEntry } from '../../domain/journal-entry.entity';
import {
  IJournalEntryRepository,
  JOURNAL_ENTRY_REPOSITORY,
  ListEntriesFilter,
} from '../../domain/journal-entry.repository';

@Injectable()
export class ListEntriesHandler {
  constructor(
    @Inject(JOURNAL_ENTRY_REPOSITORY)
    private readonly repository: IJournalEntryRepository,
  ) {}

  execute(filter: ListEntriesFilter): Promise<JournalEntry[]> {
    return this.repository.findAll(filter);
  }
}
