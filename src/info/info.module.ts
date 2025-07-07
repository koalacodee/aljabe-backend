import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { InfoController } from './controllers/info.controller';
import { InfoService } from './services/info.service';

@Module({
  imports: [PrismaModule],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
