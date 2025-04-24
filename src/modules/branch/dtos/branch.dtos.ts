import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

// Create DTO
export class CreateBranchDto {
  @ApiProperty({ example: '001' })
  @IsString()
  organization_code: string;

  @ApiProperty({ example: 'PT Example Organization' })
  @IsString()
  organization_name: string;

  @ApiProperty({ example: 123 })
  @IsInt()
  organization_id: number;

  @ApiProperty({ example: 'Main Branch' })
  @IsString()
  org_name: string;

  @ApiProperty({ example: 'ORG001' })
  @IsString()
  org_id: string;

  @ApiProperty({ example: 'Headquarters' })
  @IsString()
  organization_type: string;

  @ApiProperty({ example: 'REGION01' })
  @IsString()
  region_code: string;

  @ApiProperty({ example: 'Jl. Example No. 123, Jakarta' })
  @IsString()
  address: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  location_id: number;

  @ApiProperty({ example: '2025-01-01' })
  @IsString() // Use string for date input, or @IsDate() if using Date object
  valid_from: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsString()
  valid_to: string;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @ApiProperty({ example: 'admin' })
  @IsString()
  created_by: string;
}

// Update DTO
export class UpdateBranchDto {
  @ApiProperty({ example: '001', required: false })
  @IsOptional()
  @IsString()
  organization_code?: string;

  @ApiProperty({ example: 'PT Example Organization', required: false })
  @IsOptional()
  @IsString()
  organization_name?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsInt()
  organization_id?: number;

  @ApiProperty({ example: 'Main Branch', required: false })
  @IsOptional()
  @IsString()
  org_name?: string;

  @ApiProperty({ example: 'ORG001', required: false })
  @IsOptional()
  @IsString()
  org_id?: string;

  @ApiProperty({ example: 'Headquarters', required: false })
  @IsOptional()
  @IsString()
  organization_type?: string;

  @ApiProperty({ example: 'REGION01', required: false })
  @IsOptional()
  @IsString()
  region_code?: string;

  @ApiProperty({ example: 'Jl. Example No. 123, Jakarta', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  location_id?: number;

  @ApiProperty({ example: '2025-01-01', required: false })
  @IsOptional()
  @IsString()
  valid_from?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsString()
  valid_to?: string;

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
export class BranchResponseDto {
  @ApiProperty({ example: 1 })
  id: bigint;

  @ApiProperty({ example: '001' })
  organization_code: string;

  @ApiProperty({ example: 'PT Example Organization' })
  organization_name: string;

  @ApiProperty({ example: 123 })
  organization_id: number;

  @ApiProperty({ example: 'Main Branch' })
  org_name: string;

  @ApiProperty({ example: 'ORG001' })
  org_id: string;

  @ApiProperty({ example: 'Headquarters' })
  organization_type: string;

  @ApiProperty({ example: 'REGION01' })
  region_code: string;

  @ApiProperty({ example: 'Jl. Example No. 123, Jakarta' })
  address: string;

  @ApiProperty({ example: 1 })
  location_id: number;

  @ApiProperty({ example: '2025-01-01' })
  valid_from: Date;

  @ApiProperty({ example: '2025-12-31' })
  valid_to: Date;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: 'admin' })
  created_by: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: 'admin' })
  updated_by: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updated_at: Date;

  @ApiProperty({ example: null, required: false })
  deleted_at?: Date;
}
