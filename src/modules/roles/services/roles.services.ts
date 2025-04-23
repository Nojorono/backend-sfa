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
    return await this.prismaService.roles.update({
      data: {
        name: name?.toUpperCase(),
        description,
      },
      where: {
        id: roleId,
      },
    });
  }

  async createRoles(data: CreateRolesDto): Promise<RolesResponseDto> {
    return this.prismaService.roles.create({
      data: {
        name: data?.name?.toUpperCase(),
        description: data?.description,
      },
    });
  }

  async getRoles(): Promise<RolesResponseDto[]> {
    return this.prismaService.roles.findMany();
  }

  async getRolesById(roleId: number): Promise<RolesResponseDto> {
    return this.prismaService.roles.findUnique({ where: { id: roleId } });
  }

  async deleteRoles(roleId: number): Promise<GenericResponseDto> {
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
