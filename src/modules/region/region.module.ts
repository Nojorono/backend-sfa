import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RegionController } from './controllers/region.controllers';
import { RegionIntegrationService } from './services/region-integration.service';

@Module({
  controllers: [RegionController],
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'REGION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rmq.uri')],
            queue: configService.get<string>('rmq.region'),
            queueOptions: {
              durable: false,
            },
            noAck: true,
            persistent: false,
            prefetchCount: 1,
            // Connection management
            socketOptions: {
              heartbeatIntervalInSeconds: 5,
              reconnectTimeInSeconds: 5,
            },
          },
        }),
      },
    ]),
  ],
  providers: [RegionIntegrationService],
  exports: [RegionIntegrationService],
})
export class RegionModule {}
