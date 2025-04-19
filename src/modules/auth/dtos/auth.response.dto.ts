import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { MenuResponseDto } from 'src/modules/menu/dtos/menu.dtos';
import { UserResponseDto } from 'src/modules/user/dtos/user.response.dto';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;

  @ApiProperty()
  @Type(() => UserResponseDto)
  @ValidateNested()
  user: UserResponseDto;

  @ApiProperty({ type: [MenuResponseDto] })
  @Type(() => MenuResponseDto)
  @ValidateNested({ each: true })
  @IsOptional()
  menus?: MenuResponseDto[];
}
