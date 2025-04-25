import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerIntegrationService } from '../services/customer-integration.service';
import {
  MetaCustomerResponseDto,
  MergedCustomerResponseDto,
  PaginationParamsDto,
} from '../dtos/meta-customer.dto';

@ApiTags('customer-integration')
@Controller('customer-integration')
export class CustomerIntegrationController {
  constructor(
    private readonly customerIntegrationService: CustomerIntegrationService,
  ) {}

  @ApiBearerAuth('accessToken')
  @Get()
  @ApiOperation({ summary: 'Get merged customers from both databases' })
  @ApiResponse({
    status: 200,
    description:
      'Merged customer data from local PostgreSQL and Oracle databases',
    type: MergedCustomerResponseDto,
  })
  async getMergedCustomers(): Promise<MergedCustomerResponseDto> {
    console.log('Getting merged customers...');
    const result = await this.customerIntegrationService.getMergedCustomers();
    console.log('Merged customers result:', {
      status: result.status,
      count: result.count,
      message: result.message,
      dataCount: result.data?.length,
      firstFewRecords: result.data?.slice(0, 2), // Show first two records for debugging
    });
    return result;
  }

  @ApiBearerAuth('accessToken')
  @Get(':id')
  @ApiOperation({ summary: 'Get merged customer by ID' })
  @ApiResponse({
    status: 200,
    description:
      'Merged customer data from local PostgreSQL and Oracle databases',
    type: MergedCustomerResponseDto,
  })
  async getMergedCustomerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MergedCustomerResponseDto> {
    return this.customerIntegrationService.getMergedCustomerById(id);
  }

  @ApiBearerAuth('accessToken')
  @Get('oracle/all')
  @ApiOperation({ summary: 'Get customers from Oracle database only' })
  @ApiResponse({
    status: 200,
    description: 'Customer data from Oracle database only',
    type: MetaCustomerResponseDto,
  })
  async getOracleCustomers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<MetaCustomerResponseDto> {
    console.log('Getting Oracle customers only with params:', { page, limit });

    const paginationParams: PaginationParamsDto = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    const result =
      await this.customerIntegrationService.getOracleCustomers(
        paginationParams,
      );

    console.log('Oracle customers result:', {
      status: result.status,
      count: result.count,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      message: result.message,
      dataCount: result.data?.length,
      firstFewRecords: result.data?.slice(0, 2), // Show first two records for debugging
    });

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
