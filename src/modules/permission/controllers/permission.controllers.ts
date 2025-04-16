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
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from '../dtos/permission.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { PermissionsService } from '../services/permission.services';

@ApiTags('permissions')
@Controller({
  version: '1',
  path: '/permissions',
})
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @ApiBearerAuth('accessToken')
  @Get()
  @Serialize(PermissionResponseDto)
  getPermissions(): Promise<PermissionResponseDto[]> {
    return this.permissionService.getPermissions();
  }

  @ApiBearerAuth('accessToken')
  @Get(':id')
  @Serialize(PermissionResponseDto)
  getPermissionsById(@Param('id') id: number): Promise<PermissionResponseDto> {
    return this.permissionService.getPermissionsById(id);
  }

  @ApiBearerAuth('accessToken')
  @Put(':id')
  @Serialize(PermissionResponseDto)
  updatePermissions(
    @Param('id') id: number,
    @Body() data: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.updatePermissions(id, data);
  }

  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @Serialize(GenericResponseDto)
  deletePermissions(@Param('id') id: number): Promise<GenericResponseDto> {
    return this.permissionService.deletePermissions([id]);
  }

  @ApiBearerAuth('accessToken')
  @Post()
  @Serialize(PermissionResponseDto)
  createPermissions(
    @Body() data: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.createPermissions(data);
  }
}
