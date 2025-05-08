export class MetaRegionDtoByDate {
  last_update_date: string;
}

export class MetaRegionDto {
  region_code: string;
  region_name: string;
}

export class MetaRegionResponseDto {
  data?: MetaRegionDto[];
  count: number;
  status: boolean;
  message: string;
}
