import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerIntegrationService } from '../services/customer-integration.service';
import {
  MetaCustomerResponseDto,
  // MergedCustomerResponseDto,
  PaginationParamsDto,
} from '../dtos/meta-customer.dto';

@ApiTags('customer-integration')
@Controller('customer-integration')
export class CustomerIntegrationController {
  constructor(
    private readonly customerIntegrationService: CustomerIntegrationService,
  ) {}

  // @ApiBearerAuth('accessToken')
  // @Get()
  // @ApiOperation({ summary: 'Get merged customers from both databases' })
  // @ApiResponse({
  //   status: 200,
  //   description:
  //     'Merged customer data from local PostgreSQL and Oracle databases',
  //   type: MergedCustomerResponseDto,
  // })
  // async getMergedCustomers(): Promise<MergedCustomerResponseDto> {
  //   const result = await this.customerIntegrationService.getMergedCustomers();
  //   return result;
  // }

  // @ApiBearerAuth('accessToken')
  // @Get(':id')
  // @ApiOperation({ summary: 'Get merged customer by ID' })
  // @ApiResponse({
  //   status: 200,
  //   description:
  //     'Merged customer data from local PostgreSQL and Oracle databases',
  //   type: MergedCustomerResponseDto,
  // })
  // async getMergedCustomerById(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<MergedCustomerResponseDto> {
  //   return this.customerIntegrationService.getMergedCustomerById(id);
  // }

  @ApiBearerAuth('accessToken')
  @Get('oracle/all')
  @ApiOperation({ summary: 'Get customers from Oracle database only' })
  @ApiResponse({
    status: 200,
    description: 'Customer data from Oracle database only',
    type: MetaCustomerResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  async getOracleCustomers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<MetaCustomerResponseDto> {
    const paginationParams: PaginationParamsDto = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    const result =
      await this.customerIntegrationService.getOracleCustomers(
        paginationParams,
      );

    return result;
  }

  @ApiBearerAuth('accessToken')
  @Get('oracle/:id')
  @ApiOperation({ summary: 'Get customer from Oracle database by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer data from Oracle database only',
    type: MetaCustomerResponseDto,
  })
  async getOracleCustomerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MetaCustomerResponseDto> {
    return this.customerIntegrationService.getOracleCustomerById(id);
  }
}
