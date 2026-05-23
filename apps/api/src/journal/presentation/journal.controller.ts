import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEntryHandler } from '../application/commands/create-entry.handler';
import { DeleteEntryHandler } from '../application/commands/delete-entry.handler';
import { UpdateEntryHandler } from '../application/commands/update-entry.handler';
import { GetEntryHandler } from '../application/queries/get-entry.handler';
import { ListEntriesHandler } from '../application/queries/list-entries.handler';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { ListJournalEntriesQuery } from './dto/list-journal-entries.query';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { JournalResponseMapper } from './journal-response.mapper';

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

@Controller('construction-sites/:siteId/journal-entries')
export class JournalController {
  constructor(
    private readonly listEntriesHandler: ListEntriesHandler,
    private readonly getEntryHandler: GetEntryHandler,
    private readonly createEntryHandler: CreateEntryHandler,
    private readonly updateEntryHandler: UpdateEntryHandler,
    private readonly deleteEntryHandler: DeleteEntryHandler,
  ) {}

  @Get()
  async list(
    @Param('siteId') siteId: string,
    @Query() query: ListJournalEntriesQuery,
  ) {
    const entries = await this.listEntriesHandler.execute({
      constructionSiteId: siteId,
      dateFrom: query.dateFrom ? parseDate(query.dateFrom) : undefined,
      dateTo: query.dateTo ? parseDate(query.dateTo) : undefined,
      sort: query.sort ?? 'workDate:desc',
    });
    return entries.map(JournalResponseMapper.toDto);
  }

  @Get(':id')
  async getOne(@Param('siteId') siteId: string, @Param('id') id: string) {
    const entry = await this.getEntryHandler.execute(siteId, id);
    return JournalResponseMapper.toDto(entry);
  }

  @Post()
  async create(@Param('siteId') siteId: string, @Body() dto: CreateJournalEntryDto) {
    const entry = await this.createEntryHandler.execute({
      constructionSiteId: siteId,
      workDate: parseDate(dto.workDate),
      workTypeId: dto.workTypeId,
      employeeId: dto.employeeId,
      volume: dto.volume,
      unit: dto.unit,
    });
    return JournalResponseMapper.toDto(entry);
  }

  @Patch(':id')
  async update(
    @Param('siteId') siteId: string,
    @Param('id') id: string,
    @Body() dto: UpdateJournalEntryDto,
  ) {
    const entry = await this.updateEntryHandler.execute(siteId, id, {
      workDate: dto.workDate ? parseDate(dto.workDate) : undefined,
      workTypeId: dto.workTypeId,
      employeeId: dto.employeeId,
      volume: dto.volume,
      unit: dto.unit,
    });
    return JournalResponseMapper.toDto(entry);
  }

  @Delete(':id')
  async remove(@Param('siteId') siteId: string, @Param('id') id: string) {
    await this.deleteEntryHandler.execute(siteId, id);
    return { success: true };
  }
}
