import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: number;
  nik?: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_verified?: boolean;
  phone?: string;
  profile_picture?: string;
  role_id?: number;

  @Exclude()
  password?: string;
  updated_at?: Date;
  created_at?: Date;
  deleted_at?: Date;
}
