import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/decorators/serialize.decorator';
import {
  CreateBranchDto,
  BranchResponseDto,
  UpdateBranchDto,
  QueryBranchDto,
} from '../dtos/branch.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { BranchService } from '../services/branch.services';
import { BranchSchedulerService } from '../scheduler/branch.scheduler';
import { MetaBranchDtoByDate } from '../dtos/meta-branch.dtos';

@ApiTags('branch')
@Controller({
  version: '1',
  path: '/branch',
})
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly branchSchedulerService: BranchSchedulerService,
  ) {}

  @ApiBearerAuth('accessToken')
  @Post('meta-sync')
  async metaSync(): Promise<MetaBranchDtoByDate> {
    const result = await this.branchSchedulerService.handleTest();
    const data = {
      count: result.count,
      status: result.status,
      message: result.message,
    };
    return data;
  }

  @ApiBearerAuth('accessToken')
  @Get()
  @Serialize(BranchResponseDto)
  getBranches(@Query() query: QueryBranchDto): Promise<BranchResponseDto[]> {
    return this.branchService.getBranches(query);
  }

  @ApiBearerAuth('accessToken')
  @Get(':id')
  @Serialize(BranchResponseDto)
  getBranchesById(@Param('id') id: string): Promise<BranchResponseDto> {
    return this.branchService.getBranchesById(Number(id));
  }

  @ApiBearerAuth('accessToken')
  @Put(':id')
  @Serialize(BranchResponseDto)
  updateBranch(
    @Param('id') id: string,
    @Body() data: UpdateBranchDto,
  ): Promise<BranchResponseDto> {
    return this.branchService.updateBranch(Number(id), data);
  }

  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @Serialize(GenericResponseDto)
  deleteBranch(@Param('id') id: string): Promise<GenericResponseDto> {
    return this.branchService.deleteBranches(Number(id));
  }

  @ApiBearerAuth('accessToken')
  @Post()
  @Serialize(BranchResponseDto)
  createBranch(@Body() data: CreateBranchDto): Promise<BranchResponseDto> {
    return this.branchService.createBranch(data);
  }
}
