import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MetaBranchDtoByDate {
  data?: MetaBranchDto[];
  count: number;
  status: boolean;
  message: string;
}

export class MetaBranchDto {
  @IsString()
  @IsOptional()
  organization_code?: string;

  @IsString()
  @IsOptional()
  organization_name?: string;

  @IsNumber()
  @IsOptional()
  organization_id?: number;

  @IsString()
  @IsOptional()
  org_name?: string;

  @IsString()
  @IsOptional()
  org_id?: string;

  @IsString()
  @IsOptional()
  organization_type?: string;

  @IsString()
  @IsOptional()
  region_code?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  location_id?: number;

  @IsString()
  @IsOptional()
  start_date_active?: string;

  @IsString()
  @IsOptional()
  end_date_active?: string;
}
