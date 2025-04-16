import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: faker.internet.email(),
    required: true,
    description: 'User email address (must be unique)',
  })
  @IsEmail()
  @IsString()
  public email: string;

  @ApiProperty({
    example: faker.person.fullName(),
    description: 'Username (optional, must be unique if provided)',
  })
  @IsOptional()
  @IsString()
  public username?: string;

  @ApiProperty({
    example: faker.string.alphanumeric(10),
    description: 'Employee ID (optional, must be unique if provided)',
  })
  @IsOptional()
  @IsString()
  public employee_id?: string;

  @ApiProperty({
    example: faker.internet.password(),
    required: true,
    description: 'User password',
  })
  @IsString()
  public password: string;

  @ApiProperty({
    example: faker.image.url(),
    description: 'User profile picture URL (optional)',
  })
  @IsOptional()
  @IsString()
  public picture?: string;

  @ApiProperty({
    example: true,
    description: 'User active status (defaults to true)',
  })
  @IsOptional()
  @IsBoolean()
  public is_active?: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'User join date (optional)',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  public join_date?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'User valid from date',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  public valid_from?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'User valid to date (optional)',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  public valid_to?: string;

  @ApiProperty({
    example: 1,
    required: true,
    description: 'Role ID (required)',
  })
  @IsNumber()
  public role_id: number;

  @ApiProperty({
    example: 'admin',
    description: 'User created by (optional)',
  })
  @IsOptional()
  @IsString()
  public created_by?: string;

  @ApiProperty({
    example: 'admin',
    description: 'User updated by (optional)',
  })
  @IsOptional()
  @IsString()
  public updated_by?: string;
}
