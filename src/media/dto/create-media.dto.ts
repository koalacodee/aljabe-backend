import { IsEnum, IsNotEmpty } from 'class-validator';

export enum MediaType {
  HEADER_LOGO = 'HEADER_LOGO',
  LANDING_VIDEO = 'LANDING_VIDEO',
  TERMS_LOGO = 'TERMS_LOGO',
  TERMS_PDF = 'TERMS_PDF',
}

export class CreateMediaDto {
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;
}
