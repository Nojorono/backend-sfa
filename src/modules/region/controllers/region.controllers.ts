import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MetaRegionResponseDto } from '../dtos/region.dtos';
import { RegionIntegrationService } from '../services/region-integration.service';

@ApiTags('region')
@Controller({
  version: '1',
  path: '/region',
})
export class RegionController {
  constructor(private readonly regionService: RegionIntegrationService) {}

  @ApiBearerAuth('accessToken')
  @Get('meta-sync')
  async metaSync(): Promise<MetaRegionResponseDto> {
    const date = new Date().toISOString().split('T')[0];
    const result = await this.regionService.getOracleRegionsByDate(date);
    return result;
  }
}
