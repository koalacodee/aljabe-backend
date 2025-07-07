import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RegistrationModule } from './registration/registration.module';
import { MediaModule } from './media/media.module';
import { CodesModule } from './codes/codes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InfoModule } from './info/info.module';
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
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => [
        {
          rootPath: join(process.cwd(), 'uploads'),
          serveRoot: '/public',
          exclude: ['/api*'],
          serveStaticOptions: {
            setHeaders: (res) => {
              res.set('Access-Control-Allow-Origin', '*');
              res.set(
                'Access-Control-Allow-Methods',
                'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
              );
              res.set(
                'Access-Control-Allow-Headers',
                'Content-Type,Authorization',
              );
            },
          },
        },
        {
          rootPath: join(process.cwd(), 'vite-react', 'dist'),
          serveRoot: '/', // Vite app at root
          renderPath: '/*', // SPA wildcard
        },
      ],
    }),
    RegistrationModule,
    MediaModule,
    CodesModule,
    InfoModule,
  ],
})
export class AppModule {}
