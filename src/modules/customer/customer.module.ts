import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CustomerService } from './services/customer.services';
import { CustomerController } from './controllers/customer.controllers';

@Module({
  controllers: [CustomerController],
  imports: [],
  providers: [PrismaService, CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
