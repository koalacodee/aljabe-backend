import { IsEnum, IsString } from 'class-validator';
import { InfoType } from '@prisma/client';

export class CreateInfoDto {
  @IsEnum(InfoType)
  type: InfoType;

  @IsString()
  value: string;
}
