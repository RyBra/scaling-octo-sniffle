import { VOLUME_UNITS } from '@construction-journal/shared';
import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateWorkTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  code?: string;

  @IsOptional()
  @IsIn(VOLUME_UNITS)
  defaultUnit?: (typeof VOLUME_UNITS)[number] | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
