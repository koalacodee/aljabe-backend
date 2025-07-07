import { IsEnum, IsNotEmpty } from 'class-validator';

export enum MediaType {
  HEADER_LOGO = 'HEADER_LOGO',
  LANDING_VIDEO = 'LANDING_VIDEO',
  TERMS_LOGO = 'TERMS_LOGO',
  START_AUDIO = 'START_AUDIO',
  END_AUDIO = 'END_AUDIO',
  SPONSORS_LOGOS = 'SPONSORS_LOGOS',
}

export class CreateMediaDto {
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;
}
