import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/decorators/serialize.decorator';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { CustomerService } from '../services/customer.services';
import { CustomerQueryDto } from '../dtos/customer.dtos';
import { Query } from '@nestjs/common';
import { CustomerResponseDtoPagination } from '../dtos/customer.dtos';

@ApiTags('customer')
@Controller({
  version: '1',
  path: '/customer',
})
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiBearerAuth('accessToken')
  @Get()
  @Serialize(CustomerResponseDtoPagination)
  getCustomers(
    @Query() query: CustomerQueryDto,
  ): Promise<CustomerResponseDtoPagination> {
    return this.customerService.getCustomers(query);
  }

  // @ApiBearerAuth('accessToken')
  // @Get(':id')
  // @Serialize(CustomerResponseDto)
  // getCustomersById(@Param('id') id: number): Promise<CustomerResponseDto> {
  //   return this.customerService.getCustomersById(id);
  // }

  // @ApiBearerAuth('accessToken')
  // @Put(':id')
  // @Serialize(CustomerResponseDto)
  // updateCustomer(
  //   @Param('id') id: number,
  //   @Body() data: UpdateCustomerDto,
  // ): Promise<CustomerResponseDto> {
  //   return this.customerService.updateCustomer(id, data);
  // }

  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @Serialize(GenericResponseDto)
  deleteCustomer(@Param('id') id: number): Promise<GenericResponseDto> {
    return this.customerService.deleteCustomers([id]);
  }

  // @ApiBearerAuth('accessToken')
  // @Post()
  // @Serialize(CustomerResponseDto)
  // createCustomer(
  //   @Body() data: CreateCustomerDto,
  // ): Promise<CustomerResponseDto> {
  //   return this.customerService.createCustomer(data);
  // }
}
