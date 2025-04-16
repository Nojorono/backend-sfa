import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponseDto } from '../../../dtos/generic.response.dto';
import { Serialize } from 'src/decorators/serialize.decorator';
import { UserResponseDto } from '../dtos/user.response.dto';
import { CreateUserDto } from '../dtos/create.user.dto';

@ApiTags('admin.user')
@Controller({
  version: '1',
  path: '/admin/user',
})
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @Serialize(GenericResponseDto)
  deleteUser(@Param('id') id: number): Promise<GenericResponseDto> {
    return this.userService.softDeleteUsers([id]);
  }

  @ApiBearerAuth('accessToken')
  @Post()
  @Serialize(UserResponseDto)
  createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(data);
  }
}
