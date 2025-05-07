import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { BranchService } from './services/branch.services';
import { BranchController } from './controllers/branch.controllers';
import { BranchIntegrationService } from './services/branch-integration.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BranchSchedulerService } from './scheduler/branch.scheduler';

@Module({
  controllers: [BranchController],
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'BRANCH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rmq.uri')],
            queue: configService.get<string>('rmq.branch'),
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
    ScheduleModule.forRoot(),
  ],
  providers: [
    PrismaService,
    BranchService,
    BranchIntegrationService,
    BranchSchedulerService,
  ],
  exports: [BranchService, BranchIntegrationService],
})
export class BranchModule {}
