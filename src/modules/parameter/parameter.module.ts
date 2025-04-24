import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { ParameterService } from './services/parameter.services';
import { ParameterController } from './controllers/parameter.controllers';

@Module({
  controllers: [ParameterController],
  imports: [],
  providers: [PrismaService, ParameterService],
  exports: [ParameterService],
})
export class ParameterModule {}
