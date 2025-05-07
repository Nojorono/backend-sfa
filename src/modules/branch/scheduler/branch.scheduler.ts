// src/common/scheduler/scheduler.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as crypto from 'crypto';
import { BranchService } from '../services/branch.services';
import { BranchIntegrationService } from '../services/branch-integration.service';
import { MetaBranchDto } from '../dtos/meta-branch.dtos';

@Injectable()
export class BranchSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(BranchSchedulerService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private branchService: BranchService,
    private branchMetaService: BranchIntegrationService,
  ) {
    // Ensure crypto is available globally if needed
    if (typeof globalThis.crypto === 'undefined') {
      globalThis.crypto = crypto as any;
    }
  }

  onModuleInit() {
    this.logger.log('Scheduler branch service initialized');
  }

  // Run every daily at 1:00 AM
  @Cron('0 1 * * *')
  // @Cron('*/2 * * * *')
  async handleTest() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    this.logger.log(`[Daily Task] Running at ${now.toISOString()}`);
    const result = await this.branchMetaService.getOracleBranchesByDate(date);
    const metaBranches: MetaBranchDto[] = result.data;
    if (metaBranches.length === 0) {
      this.logger.log(`[Daily Task] No data found at ${date}`);
      return;
    }
    metaBranches.forEach((metaBranch) => {
      this.branchService.createOrUpdate(metaBranch);
    });
    this.logger.log(`[Daily Task] Done at ${now.toISOString()}`);
    return result;
  }

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
