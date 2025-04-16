import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { PermissionsService } from './services/permission.services';
import { PermissionsController } from './controllers/permission.controllers';

@Module({
  controllers: [PermissionsController],
  imports: [],
  providers: [PrismaService, PermissionsService],
  exports: [PermissionsService],
})
export class PermissionModule {}
