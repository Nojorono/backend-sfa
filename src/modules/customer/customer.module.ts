import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CustomerService } from './services/customer.services';
import { CustomerController } from './controllers/customer.controllers';
import { CustomerMicroserviceController } from './controllers/customer.microservice.controller';
import { CustomerIntegrationService } from './services/customer-integration.service';
import { CustomerIntegrationController } from './controllers/customer-integration.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [
    CustomerController,
    CustomerMicroserviceController,
    CustomerIntegrationController,
  ],
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'CUSTOMER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rmq.uri')],
            queue: configService.get<string>('rmq.customer'),
            queueOptions: {
              durable: false, // Keep this false to match existing queue configuration
            },
            noAck: true, // Disable acknowledgments to match existing queue configuration
            persistent: false, // Match existing queue configuration
            prefetchCount: 1, // Process one message at a time
            // Connection management
            socketOptions: {
              heartbeatIntervalInSeconds: 5, // Keep connection alive with frequent heartbeats
              reconnectTimeInSeconds: 5, // Reconnect quickly if connection drops
            },
          },
        }),
      },
    ]),
  ],
  providers: [PrismaService, CustomerService, CustomerIntegrationService],
  exports: [CustomerService, CustomerIntegrationService],
})
export class CustomerModule {}
