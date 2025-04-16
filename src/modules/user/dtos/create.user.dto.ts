import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiProperty({
    example: faker.phone.number(),
  })
  @IsString()
  @IsOptional()
  public phone?: string;

  @ApiProperty({
    example: faker.person.firstName(),
  })
  @IsString()
  @IsOptional()
  public firstName?: string;

  @ApiProperty({
    example: faker.person.lastName(),
  })
  @IsString()
  @IsOptional()
  public lastName?: string;

  @ApiProperty({
    example: faker.image.url(),
  })
  @IsString()
  @IsOptional()
  public profilePicture?: string;

  @ApiProperty({
    example: faker.person.fullName(),
  })
  @IsString()
  @IsOptional()
  public username?: string;

  @ApiProperty({
    example: faker.internet.password(),
  })
  @IsString()
  @IsOptional()
  public password?: string;

  @ApiProperty({
    example: faker.phone.number(),
  })
  @IsString()
  @IsOptional()
  public nik?: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  public roleId?: number;
}
