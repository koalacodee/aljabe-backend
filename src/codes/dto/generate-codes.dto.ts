import { IsInt, IsOptional, Min } from 'class-validator';

export class GenerateCodesDto {
  @IsInt()
  @Min(1)
  count: number;

  @IsOptional()
  exportToExcel?: boolean;
}
