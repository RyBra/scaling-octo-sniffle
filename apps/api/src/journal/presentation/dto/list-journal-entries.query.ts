import { IsDateString, IsIn, IsOptional } from 'class-validator';

export class ListJournalEntriesQuery {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsIn(['workDate:asc', 'workDate:desc'])
  sort?: 'workDate:asc' | 'workDate:desc';
}
