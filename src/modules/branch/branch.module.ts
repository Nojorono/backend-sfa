import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { BranchService } from './services/branch.services';
import { BranchController } from './controllers/branch.controllers';

@Module({
  controllers: [BranchController],
  imports: [],
  providers: [PrismaService, BranchService],
  exports: [BranchService],
})
export class BranchModule {}
