import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { GenericResponseDto } from '../../../dtos/generic.response.dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import { HelperHashService } from 'src/modules/auth/services/helper.hash.service';

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
    const hashedPassword = await this.helperHashService.createHash(
      data.password,
    );
    return this.prismaService.users.create({
      data: {
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

  async getUsers(): Promise<UserResponseDto[]> {
    return this.prismaService.users.findMany();
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
