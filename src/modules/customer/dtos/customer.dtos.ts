import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';

// Create DTO
export class CreateCustomerDto {
  @ApiProperty({ example: 'Customer Name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Customer Alias', required: false })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiProperty({ example: 'Retail', required: false })
  @IsOptional()
  @IsString()
  category?: string;

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

  @ApiProperty({ example: 'Retail', required: false })
  @IsOptional()
  @IsString()
  category?: string;

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

// Response DTO
export class CustomerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Customer Name' })
  name: string;

  @ApiProperty({ example: 'Customer Alias', required: false })
  alias?: string;

  @ApiProperty({ example: 'Retail', required: false })
  category?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  owner?: string;

  @ApiProperty({ example: '081234567890', required: false })
  phone?: string;

  @ApiProperty({ example: '12.345.678.9-012.345', required: false })
  npwp?: string;

  @ApiProperty({ example: '1234567890123456', required: false })
  ktp?: string;

  @ApiProperty({ example: 1, required: false })
  route_id?: number;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: 'admin' })
  created_by: string;

  @ApiProperty({ example: '2025-04-23T08:18:50.000Z' })
  created_at: Date;

  @ApiProperty({ example: 'admin' })
  updated_by: string;

  @ApiProperty({ example: '2025-04-23T08:18:50.000Z' })
  updated_at: Date;
}
