import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: number;
  email?: string;
  username?: string;
  picture?: string;
  role_id?: number;
  is_active?: boolean;
  employee_id?: string;
  valid_from?: Date;
  valid_to?: Date;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;

  @Exclude()
  password?: string;
}
