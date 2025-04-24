import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import {
  CreateBranchDto,
  BranchResponseDto,
  UpdateBranchDto,
} from '../dtos/branch.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';

@Injectable()
export class BranchService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateBranch(
    branchId: number,
    data: UpdateBranchDto,
  ): Promise<BranchResponseDto> {
    const {
      organization_code,
      organization_name,
      organization_id,
      org_name,
      org_id,
      organization_type,
      region_code,
      address,
      location_id,
      valid_from,
      valid_to,
      is_active,
      updated_by,
    } = data;
    return await this.prismaService.branch.update({
      data: {
        organization_code,
        organization_name,
        organization_id,
        org_name,
        org_id,
        organization_type,
        region_code,
        address,
        location_id,
        valid_from,
        valid_to,
        is_active,
        updated_by,
      },
      where: {
        id: branchId,
      },
    });
  }

  async createBranch(data: CreateBranchDto): Promise<BranchResponseDto> {
    return this.prismaService.branch.create({
      data: {
        organization_code: data?.organization_code,
        organization_name: data?.organization_name,
        organization_id: data?.organization_id,
        org_name: data?.org_name,
        org_id: data?.org_id,
        organization_type: data?.organization_type,
        region_code: data?.region_code,
        address: data?.address,
        location_id: data?.location_id,
        valid_from: data?.valid_from,
        valid_to: data?.valid_to,
        is_active: data?.is_active,
        created_by: data?.created_by,
        updated_by: data?.created_by,
      },
    });
  }

  async getBranches(): Promise<BranchResponseDto[]> {
    return await this.prismaService.branch.findMany({
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async getBranchesById(branchId: number): Promise<BranchResponseDto> {
    return this.prismaService.branch.findUnique({
      where: { id: branchId },
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

  async deleteBranches(branchIds: number): Promise<GenericResponseDto> {
    await this.prismaService.branch.delete({
      where: {
        id: branchIds,
      },
    });
    return {
      status: true,
      message: 'branchDeleted',
    };
  }
}
