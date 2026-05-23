import { Module } from '@nestjs/common';
import { ConstructionSiteModule } from '../construction-site/construction-site.module';
import { EmployeeModule } from '../employee/employee.module';
import { WorkTypeModule } from '../work-type/work-type.module';
import { CreateEntryHandler } from './application/commands/create-entry.handler';
import { DeleteEntryHandler } from './application/commands/delete-entry.handler';
import { UpdateEntryHandler } from './application/commands/update-entry.handler';
import { GetEntryHandler } from './application/queries/get-entry.handler';
import { ListEntriesHandler } from './application/queries/list-entries.handler';
import { JOURNAL_ENTRY_REPOSITORY } from './domain/journal-entry.repository';
import { PrismaJournalRepository } from './infrastructure/prisma-journal.repository';
import { JournalController } from './presentation/journal.controller';

@Module({
  imports: [ConstructionSiteModule, EmployeeModule, WorkTypeModule],
  controllers: [JournalController],
  providers: [
    {
      provide: JOURNAL_ENTRY_REPOSITORY,
      useClass: PrismaJournalRepository,
    },
    ListEntriesHandler,
    GetEntryHandler,
    CreateEntryHandler,
    UpdateEntryHandler,
    DeleteEntryHandler,
  ],
})
export class JournalModule {}
