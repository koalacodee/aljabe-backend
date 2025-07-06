import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService],
  imports: [PrismaModule],
})
export class RegistrationModule {}
