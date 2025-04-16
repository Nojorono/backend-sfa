// src/modules/menu/dtos/menu.dtos.ts
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

// Create DTO
export class CreateMenuDto {
  @ApiProperty({
    example: faker.lorem.word(),
    description: 'Name of the menu item',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '/dashboard',
    description: 'Unique path for the menu item',
  })
  @IsString()
  path: string;

  @ApiProperty({
    example: 'dashboard',
    description: 'Optional icon name/class',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    example: 1,
    description: 'Parent menu ID if this is a submenu',
    required: false,
  })
  @IsInt()
  @IsOptional()
  parent_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Display order of the menu item',
    required: false,
  })
  @IsInt()
  @IsOptional()
  order?: number;
}

// Update DTO
export class UpdateMenuDto {
  @ApiProperty({
    example: faker.lorem.word(),
    description: 'Name of the menu item',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '/dashboard',
    description: 'Unique path for the menu item',
    required: false,
  })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({
    example: 'dashboard',
    description: 'Optional icon name/class',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    example: 1,
    description: 'Parent menu ID if this is a submenu',
    required: false,
  })
  @IsInt()
  @IsOptional()
  parent_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Display order of the menu item',
    required: false,
  })
  @IsInt()
  @IsOptional()
  order?: number;
}

// Response DTO
export class MenuResponseDto {
  id: number;
  name: string;
  path: string;
  icon?: string;
  parent_id?: number;
  order: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  // Optional relationships
  parent?: MenuResponseDto;
  children?: MenuResponseDto[];
  permissions?: any[];
}
