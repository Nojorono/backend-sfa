import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';
import { AddressCustomer } from '@prisma/client';

export class CustomerQueryDto {
  page: number = 1;
  limit: number = 10;
  sortBy: string = 'id';
  sortOrder: 'asc' | 'desc' = 'desc';
  search?: string;
  skip?: number;
}

// Create DTO
export class CreateCustomerDto {
  @ApiProperty({ example: 'Customer Name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Customer Alias', required: false })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiProperty({ example: '081234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '12.345.678.9-012.345', required: false })
  @IsOptional()
  @IsString()
  npwp?: string;

  @ApiProperty({ example: '1234567890123456', required: false })
  @IsOptional()
  @IsString()
  ktp?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  route_id?: number;

  @ApiProperty({ example: true, default: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ example: 'admin', required: false })
  @IsOptional()
  @IsString()
  created_by?: string;
}

// Update DTO
export class UpdateCustomerDto {
  @ApiProperty({ example: 'Customer Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Customer Alias', required: false })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiProperty({ example: '081234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '12.345.678.9-012.345', required: false })
  @IsOptional()
  @IsString()
  npwp?: string;

  @ApiProperty({ example: '1234567890123456', required: false })
  @IsOptional()
  @IsString()
  ktp?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  route_id?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ example: 'admin', required: false })
  @IsOptional()
  @IsString()
  updated_by?: string;
}

export class CustomerResponseDtoPagination {
  data: CustomerResponseDto[];
  count: number;
  totalPages?: number;
  currentPage?: number;
  limit?: number;
  message?: string;
  status?: boolean;
}

// Response DTO
export class CustomerResponseDto {
  id: number;
  name: string;
  alias?: string;
  owner?: string;
  phone?: string;
  npwp?: string;
  ktp?: string;
  route_id?: number;
  credit_exposure?: string;
  overall_credit_limit?: string;
  trx_credit_limit?: string;
  channel?: string;
  customer_number?: string;
  cust_account_id?: number;
  bill_to_location?: string;
  ship_to_location?: string;
  bill_to_site_use_id?: number;
  ship_to_site_use_id?: number;
  credit_checking?: string;
  term_name?: string;
  term_id?: number;
  term_day?: number;
  price_list_name?: string;
  price_list_id?: number;
  organization_code?: string;
  organization_name?: string;
  organization_id?: number;
  org_name?: string;
  org_id?: string;
  deleted_at?: Date;
  is_active: boolean;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  addresses: AddressCustomer[];
}
