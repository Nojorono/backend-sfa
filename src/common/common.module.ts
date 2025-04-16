import configs from '../config';
import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { PrismaService } from './services/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './services/redis.service';

@Module({
  controllers: [],
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class CommonModule {}
