// src/common/scheduler/scheduler.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as crypto from 'crypto';
import { CustomerService } from '../services/customer.services';
import { CustomerIntegrationService } from '../services/customer-integration.service';
// import { MetaCustomerDto } from '../dtos/meta-customer.dto';

@Injectable()
export class CustomerSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(CustomerSchedulerService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private customerService: CustomerService,
    private customerMetaService: CustomerIntegrationService,
  ) {
    // Ensure crypto is available globally if needed
    if (typeof globalThis.crypto === 'undefined') {
      globalThis.crypto = crypto as any;
    }
  }

  onModuleInit() {
    this.logger.log('Scheduler customer service initialized');
  }

  // Run every 2 minutes
  // @Cron('*/3 * * * *')
  // async handleTest() {
  //   const now = new Date();
  //   const date = now.toISOString().split('T')[0];
  //   this.logger.log(`[3-Minute Task] Running at ${now.toISOString()}`);
  //   const result =
  //     await this.customerMetaService.getOracleCustomersByDate(date);
  //   const metaCustomers: MetaCustomerDto[] = result.data;
  //   if (metaCustomers.length === 0) {
  //     this.logger.log(`[3-Minute Task] No data found at ${date}`);
  //     return;
  //   }
  //   metaCustomers.forEach((metaCustomer) => {
  //     this.customerService.createOrUpdate(metaCustomer);
  //   });
  //   this.logger.log(`[3-Minute Task] Done at ${now.toISOString()}`);
  // }

  // // Example: Run every 30 minutes
  // @Cron('*/30 * * * *')
  // handleCron() {
  //   this.logger.debug('Running scheduled task every 30 minutes');
  // }

  // // Example: Run at 2:30 AM every day
  // @Cron('30 2 * * *')
  // handleDailyTask() {
  //   this.logger.log('Running daily task at 2:30 AM');
  // }

  // Add dynamic cron job
  addCronJob(name: string, cronTime: string, callback: () => void) {
    const job = new CronJob(cronTime, () => {
      this.logger.log(`Running dynamic job: ${name}`);
      callback();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.log(`Job ${name} added! It will run at ${cronTime}`);
  }

  // Delete a cron job
  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.log(`Job ${name} deleted!`);
  }
}
