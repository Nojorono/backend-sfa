import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { RolesService } from './services/roles.services';
import { RolesController } from './controllers/roles.controllers';

@Module({
  controllers: [RolesController],
  imports: [],
  providers: [PrismaService, RolesService],
  exports: [RolesService],
})
export class RolesModule {}
