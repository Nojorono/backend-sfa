import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsString()
  @IsNotEmpty({ message: 'email not provided' })
  public email: string;

  @ApiProperty({
    example: faker.internet.password(),
  })
  @IsString()
  @IsNotEmpty({ message: 'password not provided' })
  public password: string;

  @ApiProperty({
    example: faker.internet.ip(),
  })
  @IsString()
  @IsNotEmpty({ message: 'ip_address not provided' })
  public ip_address: string;

  @ApiProperty({
    example: faker.internet.mac(),
  })
  @IsString()
  @IsNotEmpty({ message: 'device_info not provided' })
  public device_info: string;
}
