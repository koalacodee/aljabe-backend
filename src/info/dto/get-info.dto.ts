import { IsOptional, IsEnum } from 'class-validator';
import { InfoType } from '@prisma/client';

export class GetInfoDto {
  @IsOptional()
  @IsEnum(InfoType)
  type?: InfoType;
}
