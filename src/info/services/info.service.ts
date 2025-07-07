import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateInfoDto } from '../dto/create-info.dto';
import { UpdateInfoDto } from '../dto/update-info.dto';
import { GetInfoDto } from '../dto/get-info.dto';
import { InfoType } from '@prisma/client';

@Injectable()
export class InfoService {
  constructor(private prisma: PrismaService) {}

  async create(createInfoDto: CreateInfoDto) {
    return this.prisma.info.upsert({
      where: { type: createInfoDto.type },
      update: createInfoDto,
      create: createInfoDto,
    });
  }

  async findAll(params: GetInfoDto) {
    const { type } = params;

    return this.prisma.info.findMany({
      where: type ? { type } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneByType(type: InfoType) {
    return this.prisma.info.findUnique({
      where: { type },
    });
  }

  async update(id: string, updateInfoDto: UpdateInfoDto) {
    return this.prisma.info.update({
      where: { id },
      data: updateInfoDto,
    });
  }

  async remove(id: string) {
    return this.prisma.info.delete({
      where: { id },
    });
  }
}
