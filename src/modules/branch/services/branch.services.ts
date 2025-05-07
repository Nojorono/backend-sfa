import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import {
  CreateBranchDto,
  BranchResponseDto,
  UpdateBranchDto,
  QueryBranchDto,
} from '../dtos/branch.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { MetaBranchDto } from '../dtos/meta-branch.dtos';
import { Prisma } from '@prisma/client';

@Injectable()
export class BranchService {
  private readonly logger = new Logger(BranchService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createOrUpdate(data: MetaBranchDto) {
    // First try to find existing branch without transaction
    const branch = await this.prismaService.branch.findFirst({
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

    try {
      if (branch) {
        return await this.prismaService.branch.update({
          data: branchData,
          where: { id: branch.id },
        });
      }

      return await this.prismaService.branch.create({
        data: branchData,
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

  async getBranches(query: QueryBranchDto): Promise<BranchResponseDto[]> {
    // Only build search conditions if search term is provided
    const where: Prisma.BranchWhereInput = query.search
      ? {
          OR: [
            {
              organization_code: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
            {
              organization_name: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
            {
              org_name: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
            {
              org_id: { contains: query.search, mode: 'insensitive' as const },
            },
            {
              organization_type: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
            {
              region_code: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
            {
              address: { contains: query.search, mode: 'insensitive' as const },
            },
          ],
        }
      : {};

    // Define valid sortable fields
    const validSortFields = [
      'organization_code',
      'organization_name',
      'organization_id',
      'org_name',
      'org_id',
      'organization_type',
      'region_code',
      'location_id',
      'created_at',
    ] as const;

    // Sanitize sort field and order
    const sortField = (validSortFields as readonly string[]).includes(
      query.sortBy,
    )
      ? (query.sortBy as keyof Prisma.BranchOrderByWithRelationInput)
      : 'org_name';

    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    return await this.prismaService.branch.findMany({
      where,
      orderBy: {
        [sortField]: sortOrder,
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
