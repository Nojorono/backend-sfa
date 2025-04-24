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
  CreateBranchDto,
  BranchResponseDto,
  UpdateBranchDto,
} from '../dtos/branch.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { BranchService } from '../services/branch.services';

@ApiTags('branch')
@Controller({
  version: '1',
  path: '/branch',
})
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @ApiBearerAuth('accessToken')
  @Get()
  @Serialize(BranchResponseDto)
  getBranches(): Promise<BranchResponseDto[]> {
    return this.branchService.getBranches();
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
