import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/decorators/serialize.decorator';
import {
  CreateRolesDto,
  RolesResponseDto,
  UpdateRolesDto,
} from '../dtos/roles.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { RolesService } from '../services/roles.services';

@ApiTags('roles')
@Controller({
  version: '1',
  path: '/roles',
})
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @ApiBearerAuth('accessToken')
  @Get()
  @Serialize(RolesResponseDto)
  getRoles(): Promise<RolesResponseDto[]> {
    return this.roleService.getRoles();
  }

  @ApiBearerAuth('accessToken')
  @Get(':id')
  @Serialize(RolesResponseDto)
  getRolesById(@Param('id') id: number): Promise<RolesResponseDto> {
    return this.roleService.getRolesById(id);
  }

  @ApiBearerAuth('accessToken')
  @Put(':id')
  @Serialize(RolesResponseDto)
  updateRoles(
    @Param('id') id: number,
    @Body() data: UpdateRolesDto,
  ): Promise<RolesResponseDto> {
    return this.roleService.updateRoles(id, data);
  }

  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @Serialize(GenericResponseDto)
  deleteRoles(@Param('id') id: number): Promise<GenericResponseDto> {
    return this.roleService.deleteRoles([id]);
  }

  @ApiBearerAuth('accessToken')
  @Post()
  @Serialize(RolesResponseDto)
  createRoles(@Body() data: CreateRolesDto): Promise<RolesResponseDto> {
    return this.roleService.createRoles(data);
  }
}
