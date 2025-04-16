import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { GenericResponseDto } from '../../../dtos/generic.response.dto';
import { CreateUserDto } from '../dtos/create.user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUser(
    userId: number,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { firstName, lastName, email, phone, profilePicture } = data;
    const updatedUser = await this.prismaService.users.update({
      data: {
        first_name: firstName?.trim(),
        last_name: lastName?.trim(),
        email,
        phone,
        profile_picture: profilePicture,
      },
      where: {
        id: userId,
      },
    });
    return updatedUser;
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    return this.prismaService.users.create({
      data: {
        email: data?.email,
        password: data?.password,
        first_name: data?.firstName.trim(),
        last_name: data?.lastName.trim(),
        username: data?.username.trim(),
        role: {
          connect: {
            id: data?.roleId,
          },
        },
        phone: data?.phone,
        profile_picture: data?.profilePicture,
      },
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
