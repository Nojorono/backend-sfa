import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import {
  CreateRolesDto,
  RolesResponseDto,
  UpdateRolesDto,
} from '../dtos/roles.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateRoles(
    roleId: number,
    data: UpdateRolesDto,
  ): Promise<RolesResponseDto> {
    const { name, description } = data;
    const role = await this.prismaService.roles.update({
      data: {
        name: name?.toUpperCase(),
        description,
      },
      where: {
        id: roleId,
      },
    });
    await this.prismaService.permissions.deleteMany({
      where: {
        role_id: roleId,
      },
    });
    await this.prismaService.permissions.createMany({
      data: data?.permissions?.map((permission) => ({
        role_id: roleId,
        menu_id: permission.menu_id,
        permission_type: permission.permission_type,
      })),
    });
    return role;
  }

  async createRoles(data: CreateRolesDto): Promise<RolesResponseDto> {
    const role = await this.prismaService.roles.create({
      data: {
        name: data?.name?.toUpperCase(),
        description: data?.description,
      },
    });
    await this.prismaService.permissions.createMany({
      data: data?.permissions?.map((permission) => ({
        role_id: role.id,
        menu_id: permission.menu_id,
        permission_type: permission.permission_type,
      })),
    });
    return role;
  }

  async getRoles(): Promise<RolesResponseDto[]> {
    return this.prismaService.roles.findMany({
      include: { permissions: true },
    });
  }

  async getRolesById(roleId: number): Promise<RolesResponseDto> {
    return this.prismaService.roles.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });
  }

  async deleteRoles(roleId: number): Promise<GenericResponseDto> {
    await this.prismaService.permissions.deleteMany({
      where: {
        role_id: roleId,
      },
    });
    await this.prismaService.roles.delete({
      where: {
        id: roleId,
      },
    });
    return {
      status: true,
      message: 'roleDeleted',
    };
  }
}
