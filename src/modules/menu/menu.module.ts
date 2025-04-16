import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { MenuService } from './services/menu.services';
import { MenuController } from './controllers/menu.controllers';

@Module({
  controllers: [MenuController],
  imports: [],
  providers: [PrismaService, MenuService],
  exports: [MenuService],
})
export class MenuModule {}
