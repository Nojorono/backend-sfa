import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericResponseDto } from '../../../dtos/generic.response.dto';
import { Serialize } from 'src/decorators/serialize.decorator';
import { UserResponseDto } from '../dtos/user.response.dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import { UserQueryDto } from '../dtos/query.user.dto';
import { Query } from '@nestjs/common';

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

  @ApiBearerAuth('accessToken')
  @Get('all')
  @Serialize(UserResponseDto)
  getUsers(@Query() query: UserQueryDto): Promise<UserResponseDto[]> {
    return this.userService.getUsers(query);
  }
}
