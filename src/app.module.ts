import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RegistrationModule } from './registration/registration.module';
import { MediaModule } from './media/media.module';
import { CodesModule } from './codes/codes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            limit: configService.get<number>('RATE_LIMIT_WINDOW'),
            ttl: configService.get<number>('RATE_LIMIT_MAX_REQUESTS'),
          },
        ],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // static files dir
      serveRoot: '/public',
      exclude: ['/api*'],
    }),
    RegistrationModule,
    MediaModule,
    CodesModule,
  ],
})
export class AppModule {}
