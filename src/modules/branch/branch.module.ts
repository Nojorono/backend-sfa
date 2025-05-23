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
