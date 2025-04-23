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
    // Fetch all menus with their children
    const allMenus = await this.prismaService.menus.findMany({
      include: {
        children: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Only return menus where parent_id is null (top-level), with their children
    return allMenus.filter((menu) => menu.parent_id === null);
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

  async deleteMenus(menuIds: number): Promise<GenericResponseDto> {
    // First, delete all permissions related to this menu
    await this.prismaService.permissions.deleteMany({
      where: { menu_id: menuIds },
    });

    // Then, delete the menu
    await this.prismaService.menus.delete({
      where: {
        id: menuIds,
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
