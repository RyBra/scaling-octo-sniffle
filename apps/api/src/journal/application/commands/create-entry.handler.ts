import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JournalEntry } from '../../domain/journal-entry.entity';
import {
  CreateEntryData,
  IJournalEntryRepository,
  JOURNAL_ENTRY_REPOSITORY,
} from '../../domain/journal-entry.repository';

@Injectable()
export class CreateEntryHandler {
  constructor(
    @Inject(JOURNAL_ENTRY_REPOSITORY)
    private readonly repository: IJournalEntryRepository,
  ) {}

  async execute(data: CreateEntryData): Promise<JournalEntry> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
