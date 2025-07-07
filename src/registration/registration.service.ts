import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import RegisterDto from './dto/register.dto';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const [codeExists, codeTaken] = await Promise.all([
      this.prisma.code.findUnique({ where: { code: dto.code } }),
      this.prisma.registration.findUnique({ where: { code: dto.code } }),
    ]);

    if (!codeExists) {
      throw new NotFoundException({ code: 'code_not_found' });
    }

    if (codeTaken) {
      throw new ConflictException({ code: 'code_already_taken' });
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.code.delete({ where: { code: dto.code } });

      const insertedRegistration = await tx.registration.create({
        data: dto,
      });

      return insertedRegistration;
    });
  }
}
