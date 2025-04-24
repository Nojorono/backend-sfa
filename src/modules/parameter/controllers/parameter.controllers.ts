import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/decorators/serialize.decorator';
import {
  CreateParameterDto,
  ParameterResponseDto,
  UpdateParameterDto,
} from '../dtos/parameter.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { ParameterService } from '../services/parameter.services';
import { Query } from '@nestjs/common';

@ApiTags('parameter')
@Controller({
  version: '1',
  path: '/parameter',
})
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @ApiBearerAuth('accessToken')
  @Get()
  @Serialize(ParameterResponseDto)
  getParameters(@Query('key') key?: string): Promise<ParameterResponseDto[]> {
    return this.parameterService.getParameters(key);
  }

  @ApiBearerAuth('accessToken')
  @Get(':id')
  @Serialize(ParameterResponseDto)
  getParametersById(@Param('id') id: string): Promise<ParameterResponseDto> {
    return this.parameterService.getParametersById(Number(id));
  }

  @ApiBearerAuth('accessToken')
  @Put(':id')
  @Serialize(ParameterResponseDto)
  updateParameter(
    @Param('id') id: string,
    @Body() data: UpdateParameterDto,
  ): Promise<ParameterResponseDto> {
    return this.parameterService.updateParameter(Number(id), data);
  }

  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @Serialize(GenericResponseDto)
  deleteParameter(@Param('id') id: string): Promise<GenericResponseDto> {
    return this.parameterService.deleteParameters(Number(id));
  }

  @ApiBearerAuth('accessToken')
  @Post()
  @Serialize(ParameterResponseDto)
  createParameter(
    @Body() data: CreateParameterDto,
  ): Promise<ParameterResponseDto> {
    return this.parameterService.createParameter(data);
  }
}
