import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import {
  CreateBranchDto,
  BranchResponseDto,
  UpdateBranchDto,
} from '../dtos/branch.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { MetaBranchDto } from '../dtos/meta-branch.dtos';

@Injectable()
export class BranchService {
  private readonly logger = new Logger(BranchService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createOrUpdate(data: MetaBranchDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        // First try to find existing branch
        const branch = await tx.branch.findFirst({
          where: {
            organization_id: data.organization_id,
            org_id: data.org_id,
          },
        });

        const branchData = {
          organization_code: data.organization_code ?? null,
          organization_name: data.organization_name ?? null,
          organization_id: data.organization_id ?? null,
          org_name: data.org_name ?? null,
          org_id: data.org_id ?? null,
          organization_type: data.organization_type ?? null,
          region_code: data.region_code ?? null,
          address: data.address ?? null,
          location_id: data.location_id ?? null,
          valid_from: data.start_date_active ?? null,
          valid_to: data.end_date_active ?? null,
          updated_by: 'system',
          updated_at: new Date(),
          created_by: 'system',
          ...(branch ? {} : { created_at: new Date() }),
        };

        if (branch) {
          return await tx.branch.update({
            data: branchData,
            where: { id: branch.id },
          });
        }

        return await tx.branch.create({
          data: branchData,
        });
      });
    } catch (error) {
      this.logger.error('Error in createOrUpdate branch:', error);
      throw error;
    }
  }

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
