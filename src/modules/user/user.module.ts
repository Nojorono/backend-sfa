import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { AdminUserController } from './controllers/user.admin.controller';
import { HelperHashService } from 'src/modules/auth/services/helper.hash.service';

@Module({
  controllers: [UserController, AdminUserController],
  imports: [],
  providers: [UserService, PrismaService, HelperHashService],
  exports: [UserService],
})
export class UserModule {}
