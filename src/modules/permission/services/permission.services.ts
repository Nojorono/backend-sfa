import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import {
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from '../dtos/permission.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async updatePermissions(
    permissionId: number,
    data: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const { role_id, menu_id, permission_type } = data;
    return await this.prismaService.permissions.update({
      data: {
        role_id,
        menu_id,
        permission_type,
      },
      where: {
        id: permissionId,
      },
    });
  }

  async createPermissions(
    data: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return this.prismaService.permissions.create({
      data: {
        role_id: data?.role_id,
        menu_id: data?.menu_id,
        permission_type: data?.permission_type,
      },
    });
  }

  async getPermissions(): Promise<PermissionResponseDto[]> {
    return this.prismaService.permissions.findMany({
      include: {
        role: true,
        menu: true,
      },
    });
  }

  async getPermissionsById(
    permissionId: number,
  ): Promise<PermissionResponseDto> {
    return this.prismaService.permissions.findUnique({
      include: {
        role: true,
        menu: true,
      },
      where: { id: permissionId },
    });
  }

  //   async softDeleteRoles(roleIds: number[]): Promise<GenericResponseDto> {
  //     await this.prismaService.roles.updateMany({
  //       where: {
  //         id: {
  //           in: roleIds,
  //         },
  //       },
  //       data: {
  //         deleted_at: new Date(),
  //       },
  //     });
  //     return {
  //       status: true,
  //       message: 'roleDeleted',
  //     };
  //   }

  async deletePermissions(
    permissionIds: number[],
  ): Promise<GenericResponseDto> {
    await this.prismaService.permissions.deleteMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });
    return {
      status: true,
      message: 'userDeleted',
    };
  }
}
