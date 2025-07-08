import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import RegisterDto from './dto/register.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AddCodeDto } from './dto/add-code.dto';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  async findRegistrations(pagination: PaginationDto) {
    const { cursor, limit } = pagination;

    const registrations = await this.prisma.registration.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: { codes: true },
    });

    const hasNextPage = registrations.length > limit;
    const items = hasNextPage ? registrations.slice(0, -1) : registrations;
    const nextCursor = hasNextPage
      ? registrations[registrations.length - 1].id
      : undefined;

    return {
      items,
      hasNextPage,
      nextCursor,
    };
  }

  async addCode(dto: AddCodeDto) {
    const [user, code] = await Promise.all([
      this.prisma.registration.findUnique({
        where: { id: dto.userId },
        include: { codes: true },
      }),
      this.prisma.code.findUnique({
        where: { code: dto.code },
      }),
    ]);

    if (!user) {
      throw new NotFoundException({ user: 'user_not_found' });
    }

    if (!code) {
      throw new NotFoundException({ code: 'code_not_found' });
    }

    if (code.registrationId) {
      throw new ConflictException({ code: 'code_already_taken' });
    }

    if (user.isSingleRegistered && user.codes.length === 0) {
      throw new ConflictException({ user: 'single_registration' });
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.code.update({
        where: { code: dto.code },
        data: { registration: { connect: { id: dto.userId } } },
      });

      return tx.registration.findUnique({
        where: { id: dto.userId },
        include: { codes: { select: { code: true } } },
      });
    });
  }

  async register(dto: RegisterDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code, ...toInsert } = dto;

    const existingCode = await (dto.code
      ? this.prisma.code.findUnique({ where: { code: dto.code } })
      : undefined);

    if (dto.code && !existingCode) {
      throw new NotFoundException({ code: 'code_not_found' });
    }

    if (dto.code && existingCode.registrationId) {
      throw new ConflictException({ code: 'code_already_taken' });
    }

    return await this.prisma.$transaction(async (tx) => {
      const insertedRegistration = await tx.registration.upsert({
        where: { phone: dto.phone },
        create: {
          ...toInsert,
          codes: dto.code ? { connect: { id: existingCode.id } } : undefined,
        },
        update: {
          ...toInsert,
          codes: dto.code ? { connect: { id: existingCode.id } } : undefined,
        },
      });

      return insertedRegistration;
    });
  }
}
