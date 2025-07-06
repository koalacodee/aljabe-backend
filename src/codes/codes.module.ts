import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [CodesController],
  providers: [CodesService],
  exports: [CodesService],
})
export class CodesModule {}
