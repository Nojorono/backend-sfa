import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import {
  CustomerResponseDto,
  CustomerResponseDtoPagination,
  CustomerQueryDto,
} from '../dtos/customer.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  // async updateCustomer(
  //   customerId: number,
  //   data: UpdateCustomerDto,
  // ): Promise<CustomerResponseDto> {
  //   const { name, alias, owner, phone, npwp, ktp, route_id, is_active } = data;
  //   return await this.prismaService.customers.update({
  //     data: {
  //       name,
  //       alias,
  //       owner,
  //       phone,
  //       npwp,
  //       ktp,
  //       route_id,
  //       is_active,
  //       credit_exposure: data?.credit_exposure,
  //       overall_credit_limit: data?.overall_credit_limit,
  //       trx_credit_limit: data?.trx_credit_limit,
  //     },
  //     where: {
  //       id: customerId,
  //     },
  //   });
  // }

  // async createCustomer(data: CreateCustomerDto): Promise<CustomerResponseDto> {
  //   return this.prismaService.customers.create({
  //     data: {
  //       name: data?.name,
  //       alias: data?.alias,
  //       owner: data?.owner,
  //       phone: data?.phone,
  //       npwp: data?.npwp,
  //       ktp: data?.ktp,
  //       route_id: data?.route_id,
  //       is_active: data?.is_active,
  //       created_by: 'admin',
  //       updated_by: 'admin',
  //       credit_exposure: data?.credit_exposure,
  //       overall_credit_limit: data?.overall_credit_limit,
  //       trx_credit_limit: data?.trx_credit_limit,
  //     },
  //   });
  // }

  async getCustomers(
    query: CustomerQueryDto,
  ): Promise<CustomerResponseDtoPagination> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'id',
      sortOrder = 'desc',
    } = query;

    const paginationParams: CustomerQueryDto = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
      search,
      skip: (page - 1) * limit,
    };

    const where: Prisma.CustomersWhereInput = {
      deleted_at: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { alias: { contains: search, mode: 'insensitive' } },
        { owner: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { npwp: { contains: search, mode: 'insensitive' } },
        { ktp: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sortBy] = sortOrder;

    const [customers, count] = await Promise.all([
      this.prismaService.customers.findMany({
        include: {
          addresses: true,
        },
        where,
        skip: paginationParams.skip,
        take: paginationParams.limit,
        orderBy,
      }),
      this.prismaService.customers.count({ where }),
    ]);

    return {
      data: customers as unknown as CustomerResponseDto[],
      count,
      totalPages: Math.ceil(count / paginationParams.limit),
      currentPage: paginationParams.page,
      limit: paginationParams.limit,
      message: 'Customers fetched successfully',
      status: true,
    };
  }

  // async getCustomersById(customerId: number): Promise<CustomerResponseDto> {
  //   return this.prismaService.customers.findUnique({
  //     where: { id: customerId },
  //   });
  // }

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

  async deleteCustomers(menuIds: number[]): Promise<GenericResponseDto> {
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
}
