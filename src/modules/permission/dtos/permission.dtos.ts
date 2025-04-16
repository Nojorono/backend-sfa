// src/modules/permission/dtos/permission.dtos.ts
import { ApiProperty } from '@nestjs/swagger';
import { PermissionType } from '@prisma/client';
import { IsOptional, IsInt, IsEnum, IsString } from 'class-validator';
// Create DTO
export class CreatePermissionDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the role to assign this permission to',
  })
  @IsInt()
  role_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the menu item this permission applies to',
  })
  @IsInt()
  menu_id: number;

  @ApiProperty({
    example: 'View',
    description: 'Type of permission (View, Create, Update, Delete, Manage)',
  })
  @IsString()
  permission_type: PermissionType;
}

// Update DTO
export class UpdatePermissionDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the role to assign this permission to',
    required: false,
  })
  @IsInt()
  @IsOptional()
  role_id?: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the menu item this permission applies to',
    required: false,
  })
  @IsInt()
  @IsOptional()
  menu_id?: number;

  @ApiProperty({
    example: 'View',
    enum: PermissionType,
    description: 'Type of permission (View, Create, Update, Delete, Manage)',
    required: false,
  })
  @IsEnum(PermissionType)
  @IsOptional()
  permission_type?: PermissionType;
}

// Response DTO
export class PermissionResponseDto {
  id: number;
  role_id: number;
  menu_id: number;
  permission_type: PermissionType;
  // Optional relationships
  role?: {
    id?: number;
    name?: string;
    description?: string;
  };
  menu?: {
    id?: number;
    name?: string;
    path?: string;
    icon?: string;
    parent_id?: number;
    order?: number;
  };
}
