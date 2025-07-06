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
}
