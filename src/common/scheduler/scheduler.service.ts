// src/common/scheduler/scheduler.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as crypto from 'crypto';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    // Ensure crypto is available globally if needed
    if (typeof globalThis.crypto === 'undefined') {
      globalThis.crypto = crypto as any;
    }
  }

  onModuleInit() {
    this.logger.log('Scheduler service initialized');
  }

  // Run every 2 minutes
  @Cron('*/2 * * * *')
  handleTwoMinuteTask() {
    const now = new Date();
    this.logger.log(`[2-Minute Task] Running at ${now.toISOString()}`);
  }

  // Example: Run every 30 minutes
  @Cron('*/30 * * * *')
  handleCron() {
    this.logger.debug('Running scheduled task every 30 minutes');
  }

  // Example: Run at 2:30 AM every day
  @Cron('30 2 * * *')
  handleDailyTask() {
    this.logger.log('Running daily task at 2:30 AM');
  }

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
