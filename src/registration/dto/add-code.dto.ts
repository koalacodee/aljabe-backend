import { IsString, IsUUID } from 'class-validator';

export class AddCodeDto {
  @IsUUID()
  userId: string;

  @IsString()
  code: string;
}
