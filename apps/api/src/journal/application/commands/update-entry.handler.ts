import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JournalEntry } from '../../domain/journal-entry.entity';
import {
  IJournalEntryRepository,
  JOURNAL_ENTRY_REPOSITORY,
  UpdateEntryData,
} from '../../domain/journal-entry.repository';

@Injectable()
export class UpdateEntryHandler {
  constructor(
    @Inject(JOURNAL_ENTRY_REPOSITORY)
    private readonly repository: IJournalEntryRepository,
  ) {}

  async execute(
    constructionSiteId: string,
    id: string,
    data: UpdateEntryData,
  ): Promise<JournalEntry> {
    try {
      return await this.repository.update(constructionSiteId, id, data);
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
