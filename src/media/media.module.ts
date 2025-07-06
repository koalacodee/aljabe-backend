import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

@Module({
  imports: [PrismaModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
