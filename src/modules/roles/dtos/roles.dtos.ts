import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionType } from '@prisma/client';

export class CreateRolesPermissionsDto {
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

export class CreateRolesDto {
  @ApiProperty({
    example: faker.internet.domainName(),
  })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({
    type: [CreateRolesPermissionsDto],
    description: 'Array of permissions for this role',
    example: [
      { menu_id: 1, permission_type: 'View' },
      { menu_id: 2, permission_type: 'Create' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRolesPermissionsDto)
  public permissions: CreateRolesPermissionsDto[];
}

export class UpdateRolesDto {
  @ApiProperty({
    example: faker.internet.domainName(),
  })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({
    type: [CreateRolesPermissionsDto],
    description: 'Array of permissions for this role',
    example: [
      { menu_id: 1, permission_type: 'View' },
      { menu_id: 2, permission_type: 'Create' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRolesPermissionsDto)
  public permissions?: CreateRolesPermissionsDto[];
}

export class RolesResponseDto {
  id: number;
  name: string;
  description: string;
}
