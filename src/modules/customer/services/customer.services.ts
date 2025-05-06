import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import {
  CustomerResponseDto,
  CustomerResponseDtoPagination,
  CustomerQueryDto,
} from '../dtos/customer.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { Prisma } from '@prisma/client';
import { MetaCustomerDto } from '../dtos/meta-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrUpdate(data: MetaCustomerDto) {
    const site_use_id = data.customer_number + '/' + data.bill_to_site_use_id;

    const customer = await this.prismaService.customers.findUnique({
      where: { site_use_id },
      include: {
        addresses: true,
      },
    });

    const customerData = {
      name: data.customer_name,
      alias: null,
      owner: null,
      phone: null,
      npwp: null,
      ktp: null,
      is_active: true,
      credit_exposure: String(data.credit_exposure ?? '0'),
      overall_credit_limit: String(data.overall_credit_limit ?? '0'),
      trx_credit_limit: String(data.trx_credit_limit ?? '0'),
      site_use_id,
      // Oracle Integration Fields
      channel: data.channel ?? null,
      customer_number: data.customer_number ?? null,
      cust_account_id: data.cust_account_id ?? null,
      bill_to_location: data.bill_to_location ?? null,
      ship_to_location: data.ship_to_location ?? null,
      order_type_name: data.order_type_name ?? null,
      order_type_id: data.order_type_id ?? null,
      return_order_type_name: data.return_order_type_name ?? null,
      return_order_type_id: data.return_order_type_id ?? null,
      site_type: data.site_type ?? null,
      bill_to_site_use_id: data.bill_to_site_use_id ?? null,
      ship_to_site_use_id: data.ship_to_site_use_id ?? null,
      // Terms and Pricing
      term_name: data.term_name ?? null,
      term_id: data.term_id ?? null,
      term_day: data.term_day ?? null,
      price_list_name: data.price_list_name ?? null,
      price_list_id: data.price_list_id ?? null,
      // Organization Information
      organization_code: data.organization_code ?? null,
      organization_name: data.organization_name ?? null,
      organization_id: data.organization_id ?? null,
      org_name: data.org_name ?? null,
      org_id: data.org_id ?? null,
      // Audit Fields
      created_by: 'system',
      updated_by: 'system',
      updated_at: new Date(),
      created_at: customer ? undefined : new Date(),
    };

    if (customer) {
      const updatedCustomer = await this.prismaService.customers.update({
        data: customerData,
        where: { site_use_id },
      });
      await this.prismaService.addressCustomer.update({
        where: { id: customer?.addresses?.[0]?.id ?? 0 },
        data: {
          address1: data.address1 ?? null,
          provinsi: data.provinsi ?? null,
          kab_kodya: data.kab_kodya ?? null,
          kecamatan: data.kecamatan ?? null,
          kelurahan: data.kelurahan ?? null,
          kodepos: data.kodepos ?? null,
          updated_by: 'system',
          updated_at: new Date(),
        },
      });
      return updatedCustomer;
    }
    const createdCustomer = await this.prismaService.customers.create({
      data: customerData,
    });
    await this.prismaService.addressCustomer.create({
      data: {
        address1: data.address1 ?? null,
        provinsi: data.provinsi ?? null,
        kab_kodya: data.kab_kodya ?? null,
        kecamatan: data.kecamatan ?? null,
        kelurahan: data.kelurahan ?? null,
        kodepos: data.kodepos ?? null,
        created_by: 'system',
        updated_by: 'system',
        customer_id: createdCustomer.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return createdCustomer;
  }

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
