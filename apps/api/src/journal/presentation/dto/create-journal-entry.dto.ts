import { VOLUME_UNITS } from '@construction-journal/shared';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateJournalEntryDto {
  @IsDateString()
  workDate!: string;

  @IsString()
  @IsNotEmpty()
  workTypeId!: string;

  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsNumber()
  @IsPositive()
  volume!: number;

  @IsIn(VOLUME_UNITS)
  unit!: (typeof VOLUME_UNITS)[number];
}
