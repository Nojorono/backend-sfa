import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
}

export class RolesResponseDto {
  id: number;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
