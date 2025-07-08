import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;
}
