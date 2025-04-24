// src/modules/parameter/dtos/parameter.dtos.ts
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

// Create DTO
export class CreateParameterDto {
  @ApiProperty({
    example: faker.lorem.word(),
    description: 'Name of the parameter',
    required: false,
  })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({
    example: '/dashboard',
    description: 'Unique path for the menu item',
    required: false,
  })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({
    example: 'dashboard',
    description: 'Optional icon name/class',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({
    example: true,
    description: 'Is active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: 'admin',
    description: 'Created by',
    required: false,
  })
  @IsString()
  @IsOptional()
  created_by?: string;
}

// Update DTO
export class UpdateParameterDto {
  @ApiProperty({
    example: faker.lorem.word(),
    description: 'Name of the parameter',
    required: false,
  })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({
    example: '/dashboard',
    description: 'Unique path for the menu item',
    required: false,
  })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({
    example: 'dashboard',
    description: 'Optional icon name/class',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({
    example: true,
    description: 'Is active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: 'admin',
    description: 'Updated by',
    required: false,
  })
  @IsString()
  @IsOptional()
  updated_by?: string;
}

// Response DTO
export class ParameterResponseDto {
  id: number;
  key: string;
  value: string;
  label: string;
  is_active: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
