import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: faker.internet.email(),
    description: 'User email address',
  })
  @IsEmail()
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiProperty({
    example: 1,
    description: 'Role ID (optional)',
  })
  @IsNumber()
  @IsOptional()
  public role_id?: number;

  @ApiProperty({
    example: faker.image.url(),
    description: 'User profile picture URL',
  })
  @IsString()
  @IsOptional()
  public picture?: string;

  @ApiProperty({
    example: faker.string.alphanumeric(10),
    description: 'Employee ID',
  })
  @IsString()
  @IsOptional()
  public employee_id?: string;

  @ApiProperty({
    example: true,
    description: 'User active status',
  })
  @IsBoolean()
  @IsOptional()
  public is_active?: boolean;

  @ApiProperty({
    example: faker.date.past(),
    description: 'User valid from date',
  })
  @IsString()
  @IsOptional()
  public valid_from?: string;

  @ApiProperty({
    example: faker.date.future(),
    description: 'User valid to date',
  })
  @IsString()
  @IsOptional()
  public valid_to?: string;

  @ApiProperty({
    example: 'admin',
    description: 'User updated by',
  })
  @IsString()
  @IsOptional()
  public updated_by?: string;
}
