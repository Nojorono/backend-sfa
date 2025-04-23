import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import {
  CreateCustomerDto,
  CustomerResponseDto,
  UpdateCustomerDto,
} from '../dtos/customer.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateCustomer(
    customerId: number,
    data: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const {
      name,
      alias,
      category,
      owner,
      phone,
      npwp,
      ktp,
      route_id,
      is_active,
    } = data;
    return await this.prismaService.customers.update({
      data: {
        name,
        alias,
        category,
        owner,
        phone,
        npwp,
        ktp,
        route_id,
        is_active,
      },
      where: {
        id: customerId,
      },
    });
  }

  async createCustomer(data: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.prismaService.customers.create({
      data: {
        name: data?.name,
        alias: data?.alias,
        category: data?.category,
        owner: data?.owner,
        phone: data?.phone,
        npwp: data?.npwp,
        ktp: data?.ktp,
        route_id: data?.route_id,
        is_active: data?.is_active,
        created_by: 'admin',
        updated_by: 'admin',
      },
    });
  }

  async getCustomers(): Promise<CustomerResponseDto[]> {
    return this.prismaService.customers.findMany();
  }

  async getCustomersById(customerId: number): Promise<CustomerResponseDto> {
    return this.prismaService.customers.findUnique({
      where: { id: customerId },
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
