import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerService } from '../services/customer.services';
import {
  CreateCustomerDto,
  CustomerResponseDto,
  UpdateCustomerDto,
} from '../dtos/customer.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';

@Controller()
export class CustomerMicroserviceController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern('get_customers')
  async getCustomers(): Promise<CustomerResponseDto[]> {
    return this.customerService.getCustomers();
  }

  @MessagePattern('get_customer_by_id')
  async getCustomerById(
    @Payload() data: { customerId: number },
  ): Promise<CustomerResponseDto> {
    return this.customerService.getCustomersById(data.customerId);
  }

  @MessagePattern('create_customer')
  async createCustomer(
    @Payload() data: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.createCustomer(data);
  }

  @MessagePattern('update_customer')
  async updateCustomer(
    @Payload() data: { customerId: number; updateData: UpdateCustomerDto },
  ): Promise<CustomerResponseDto> {
    return this.customerService.updateCustomer(
      data.customerId,
      data.updateData,
    );
  }

  @MessagePattern('delete_customers')
  async deleteCustomers(
    @Payload() data: { customerIds: number[] },
  ): Promise<GenericResponseDto> {
    return this.customerService.deleteCustomers(data.customerIds);
  }
}
