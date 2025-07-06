import { IsString } from 'class-validator';

export class DownloadCodeDto {
  @IsString()
  filename: string;
}
