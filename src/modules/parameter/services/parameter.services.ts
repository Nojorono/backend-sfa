import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import {
  CreateParameterDto,
  ParameterResponseDto,
  UpdateParameterDto,
} from '../dtos/parameter.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';

@Injectable()
export class ParameterService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateParameter(
    parameterId: number,
    data: UpdateParameterDto,
  ): Promise<ParameterResponseDto> {
    const { key, value, label, is_active, updated_by } = data;
    return await this.prismaService.parameters.update({
      data: {
        key,
        value,
        label,
        is_active,
        updated_by,
      },
      where: {
        id: parameterId,
      },
    });
  }

  async createParameter(
    data: CreateParameterDto,
  ): Promise<ParameterResponseDto> {
    return this.prismaService.parameters.create({
      data: {
        key: data?.key,
        value: data?.value,
        label: data?.label,
        is_active: data?.is_active,
        created_by: data?.created_by,
        updated_by: data?.created_by,
      },
    });
  }

  async getParameters(key?: string): Promise<ParameterResponseDto[]> {
    return await this.prismaService.parameters.findMany({
      where: key ? { key } : undefined,
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async getParametersById(parameterId: number): Promise<ParameterResponseDto> {
    return this.prismaService.parameters.findUnique({
      where: { id: parameterId },
    });
  }

  async deleteParameters(parameterIds: number): Promise<GenericResponseDto> {
    await this.prismaService.parameters.delete({
      where: {
        id: parameterIds,
      },
    });
    return {
      status: true,
      message: 'parameterDeleted',
    };
  }
}
