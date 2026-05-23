import { VOLUME_UNITS } from '@construction-journal/shared';
import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWorkTypeDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  code!: string;

  @IsOptional()
  @IsIn(VOLUME_UNITS)
  defaultUnit?: (typeof VOLUME_UNITS)[number];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
