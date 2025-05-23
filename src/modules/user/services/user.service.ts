import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { GenericResponseDto } from '../../../dtos/generic.response.dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import { HelperHashService } from 'src/modules/auth/services/helper.hash.service';
import { v4 as uuidv4 } from 'uuid';
import { UserQueryDto } from '../dtos/query.user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly helperHashService: HelperHashService,
  ) {}

  async updateUser(
    userId: number,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { email, picture, employee_id, is_active, valid_from, valid_to } =
      data;
    const updatedUser = await this.prismaService.users.update({
      data: {
        email,
        picture,
        employee_id,
        is_active,
        valid_from,
        valid_to,
      },
      where: {
        id: userId,
      },
    });
    return updatedUser;
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const userUuid = uuidv4(); // Generate a UUID
    const hashedPassword = await this.helperHashService.createHash(
      data.password,
    );
    return this.prismaService.users.create({
      data: {
        user_uuid: userUuid,
        role_id: data?.role_id,
        email: data?.email,
        password: hashedPassword,
        username: data?.username.trim(),
        employee_id: data?.employee_id,
        picture: data?.picture,
        is_active: data?.is_active,
        join_date: data?.join_date,
        valid_from: data?.valid_from,
        valid_to: data?.valid_to,
      },
    });
  }

  async getUsers(query: UserQueryDto): Promise<UserResponseDto[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'desc',
      search,
      role,
      is_active,
    } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        // add other searchable fields as needed
      ];
    }

    if (role) {
      where.role = role;
    }

    if (typeof is_active !== 'undefined') {
      where.is_active = is_active === 'true';
    }

    return this.prismaService.users.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async getUserById(userId: number): Promise<UserResponseDto> {
    return this.prismaService.users.findUnique({ where: { id: userId } });
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    return this.prismaService.users.findUnique({ where: { email } });
  }

  async softDeleteUsers(userIds: number[]): Promise<GenericResponseDto> {
    await this.prismaService.users.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return {
      status: true,
      message: 'userDeleted',
    };
  }

  async deleteUsers(userIds: number[]): Promise<GenericResponseDto> {
    await this.prismaService.users.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    return {
      status: true,
      message: 'userDeleted',
    };
  }
}
