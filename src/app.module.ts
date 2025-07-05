import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RegistrationModule } from './registration/registration.module';
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
    RegistrationModule,
  ],
})
export class AppModule {}
