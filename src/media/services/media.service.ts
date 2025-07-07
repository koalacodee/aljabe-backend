import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MediaType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async findOne(type: MediaType) {
    return this.prisma.media.findFirst({
      where: { type },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(type: MediaType, fileName: string) {
    // Delete existing media of the same type
    await this.prisma.media.deleteMany({ where: { type } });

    const url = `${this.config.get('HOST')}:${this.config.get('PORT')}/public/${fileName}`;

    return this.prisma.media.create({
      data: {
        type,
        url,
      },
    });
  }

  async getAllMedia() {
    const media = await this.prisma.media.findMany({
      select: {
        type: true,
        url: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Group media by type and get the latest one for each type
    const groupedMedia = {};
    media.forEach((item) => {
      groupedMedia[item.type] = item.url;
    });

    return groupedMedia;
  }
}
