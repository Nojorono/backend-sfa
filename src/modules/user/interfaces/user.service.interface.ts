import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserResponseDto } from '../dtos/user.response.dto';

export interface IUserService {
  updateUser(userId: number, data: UpdateUserDto): Promise<UserResponseDto>;
  getUserById(userId: number): Promise<UserResponseDto>;
  getUserByEmail(email: string): Promise<UserResponseDto>;
  softDeleteUsers(userIds: number[]): Promise<GenericResponseDto>;
  deleteUsers(userIds: number[]): Promise<GenericResponseDto>;
}
