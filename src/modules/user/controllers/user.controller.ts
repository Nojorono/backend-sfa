import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { IAuthPayload } from 'src/modules/auth/interfaces/auth.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { TransformMessagePayload } from 'src/decorators/payload.decorator';
import { AuthUser } from 'src/decorators/auth.decorator';
import { UserResponseDto } from '../dtos/user.response.dto';
import { Serialize } from 'src/decorators/serialize.decorator';

@ApiTags('user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('getUserById')
  public async getUserById(
    @TransformMessagePayload() payload: Record<string, any>,
  ) {
    return this.userService.getUserById(payload.userId);
  }

  @ApiBearerAuth('accessToken')
  @Put(':id')
  @Serialize(UserResponseDto)
  updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.updateUser(numericId, data);
  }

  @ApiBearerAuth('accessToken')
  @Get('profile')
  @Serialize(UserResponseDto)
  getUserInfo(@AuthUser() user: IAuthPayload): Promise<UserResponseDto> {
    return this.userService.getUserById(user.id);
  }
}
