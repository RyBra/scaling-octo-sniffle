import { VOLUME_UNITS } from '@construction-journal/shared';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsDateString()
  workDate?: string;

  @IsOptional()
  @IsString()
  workTypeId?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  volume?: number;

  @IsOptional()
  @IsIn(VOLUME_UNITS)
  unit?: (typeof VOLUME_UNITS)[number];
}
