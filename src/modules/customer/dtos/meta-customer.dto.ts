import { IsNumber, IsOptional, IsString } from 'class-validator';

// DTO for customers from Oracle (backend-sfa-meta)
export class MetaCustomerDto {
  @IsString()
  @IsOptional()
  address1?: string;

  @IsString()
  @IsOptional()
  bill_to_location?: string;

  @IsNumber()
  @IsOptional()
  bill_to_site_use_id?: number;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsOptional()
  credit_checking?: string;

  @IsNumber()
  @IsOptional()
  credit_exposure?: number;

  @IsNumber()
  @IsOptional()
  cust_account_id?: number;

  @IsString()
  customer_name: string;

  @IsString()
  @IsOptional()
  customer_number?: string;

  @IsString()
  @IsOptional()
  kab_kodya?: string;

  @IsString()
  @IsOptional()
  kecamatan?: string;

  @IsString()
  @IsOptional()
  kelurahan?: string;

  @IsString()
  @IsOptional()
  last_update_date?: string;

  @IsString()
  @IsOptional()
  order_type_id?: string;

  @IsString()
  @IsOptional()
  order_type_name?: string;

  @IsString()
  @IsOptional()
  org_id?: string;

  @IsString()
  @IsOptional()
  org_name?: string;

  @IsString()
  @IsOptional()
  organization_code?: string;

  @IsNumber()
  @IsOptional()
  organization_id?: number;

  @IsString()
  @IsOptional()
  organization_name?: string;

  @IsNumber()
  @IsOptional()
  overall_credit_limit?: number;

  @IsNumber()
  @IsOptional()
  price_list_id?: number;

  @IsString()
  @IsOptional()
  price_list_name?: string;

  @IsString()
  @IsOptional()
  provinsi?: string;

  @IsString()
  @IsOptional()
  return_order_type_id?: string;

  @IsString()
  @IsOptional()
  return_order_type_name?: string;

  @IsString()
  @IsOptional()
  ship_to_location?: string;

  @IsNumber()
  @IsOptional()
  ship_to_site_use_id?: number;

  @IsString()
  @IsOptional()
  site_type?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  term_day?: number;

  @IsNumber()
  @IsOptional()
  term_id?: number;

  @IsString()
  @IsOptional()
  term_name?: string;

  @IsNumber()
  @IsOptional()
  trx_credit_limit?: number;
}

export class PaginationParamsDto {
  page?: number;
  limit?: number;
  search?: string;
}

export class MetaCustomerResponseDto {
  data: MetaCustomerDto[];
  count: number;
  totalPages?: number;
  currentPage?: number;
  limit?: number;
  message?: string;
  status?: boolean;
}

// Combined DTO for merged customers data (backend-sfa + backend-sfa-meta)
export class MergedCustomerDto {
  // Fields from local database
  id?: number;
  name: string;
  alias?: string;
  category?: string;
  owner?: string;
  phone?: string;
  npwp?: string;
  ktp?: string;
  route_id?: number;
  is_active?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;

  // Fields from Oracle database
  cust_account_id?: number;
  address1?: string;
  bill_to_location?: string;
  bill_to_site_use_id?: number;
  channel?: string;
  credit_checking?: string;
  credit_exposure?: number;
  customer_number?: string;
  kab_kodya?: string;
  kecamatan?: string;
  kelurahan?: string;
  last_update_date?: string;
  order_type_id?: string;
  order_type_name?: string;
  org_id?: string;
  org_name?: string;
  organization_code?: string;
  organization_id?: number;
  organization_name?: string;
  overall_credit_limit?: number;
  price_list_id?: number;
  price_list_name?: string;
  provinsi?: string;
  return_order_type_id?: string;
  return_order_type_name?: string;
  ship_to_location?: string;
  ship_to_site_use_id?: number;
  site_type?: string;
  term_day?: number;
  term_id?: number;
  term_name?: string;
  trx_credit_limit?: number;
}

export class MergedCustomerResponseDto {
  data: MergedCustomerDto[];
  count: number;
  totalPages?: number;
  currentPage?: number;
  limit?: number;
  message?: string;
  status?: boolean;
}
