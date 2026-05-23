import { Inject, Injectable } from '@nestjs/common';
import {
  IJournalEntryRepository,
  JOURNAL_ENTRY_REPOSITORY,
} from '../../domain/journal-entry.repository';

@Injectable()
export class DeleteEntryHandler {
  constructor(
    @Inject(JOURNAL_ENTRY_REPOSITORY)
    private readonly repository: IJournalEntryRepository,
  ) {}

  execute(constructionSiteId: string, id: string): Promise<void> {
    return this.repository.delete(constructionSiteId, id);
  }
}
