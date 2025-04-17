import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import {
  CreateMenuDto,
  MenuResponseDto,
  UpdateMenuDto,
} from '../dtos/menu.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateMenu(
    menuId: number,
    data: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    const { name, path, icon, parent_id, order } = data;
    return await this.prismaService.menus.update({
      data: {
        name,
        path,
        icon,
        parent_id: parent_id || null,
        order,
      },
      where: {
        id: menuId,
      },
    });
  }

  async createMenu(data: CreateMenuDto): Promise<MenuResponseDto> {
    return this.prismaService.menus.create({
      data: {
        name: data?.name,
        path: data?.path,
        icon: data?.icon,
        parent_id: data?.parent_id || null,
        order: data?.order,
      },
    });
  }

  async getMenus(): Promise<MenuResponseDto[]> {
    return this.prismaService.menus.findMany({
      include: {
        // parent: true,
        children: true,
      },
    });
  }

  async getMenusById(menuId: number): Promise<MenuResponseDto> {
    return this.prismaService.menus.findUnique({ where: { id: menuId } });
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

  async deleteMenus(menuIds: number[]): Promise<GenericResponseDto> {
    await this.prismaService.menus.deleteMany({
      where: {
        id: {
          in: menuIds,
        },
      },
    });
    return {
      status: true,
      message: 'menuDeleted',
    };
  }

  async getMenusByParent(): Promise<MenuResponseDto[]> {
    return this.prismaService.menus.findMany({
      where: {
        parent_id: null,
      },
    });
  }
}
