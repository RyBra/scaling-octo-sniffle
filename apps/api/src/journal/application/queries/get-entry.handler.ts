import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JournalEntry } from '../../domain/journal-entry.entity';
import {
  IJournalEntryRepository,
  JOURNAL_ENTRY_REPOSITORY,
} from '../../domain/journal-entry.repository';

@Injectable()
export class GetEntryHandler {
  constructor(
    @Inject(JOURNAL_ENTRY_REPOSITORY)
    private readonly repository: IJournalEntryRepository,
  ) {}

  async execute(constructionSiteId: string, id: string): Promise<JournalEntry> {
    const entry = await this.repository.findById(constructionSiteId, id);
    if (!entry) {
      throw new NotFoundException('Запись не найдена');
    }
    return entry;
  }
}
