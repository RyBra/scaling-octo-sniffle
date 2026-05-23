import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateConstructionSiteDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  address?: string | null;
}
