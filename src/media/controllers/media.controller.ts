import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { MediaService } from '../services/media.service';
import { CreateMediaDto } from '../dto/create-media.dto';
import { MediaType } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post(':type')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async createOrUpdateMedia(
    @Param() params: CreateMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Update the DTO with the uploaded file
    // Update existing media or create new one
    return await this.mediaService.update(params.type, file.filename);
  }

  @Get(':type')
  async getMedia(@Param('type') type: string) {
    // Validate type parameter
    if (!Object.values(MediaType).includes(type as MediaType)) {
      throw new BadRequestException('Invalid media type');
    }

    return await this.mediaService.findOne(type as MediaType);
  }
}
