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
  CreateMenuDto,
  MenuResponseDto,
  UpdateMenuDto,
} from '../dtos/menu.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { MenuService } from '../services/menu.services';

@ApiTags('menu')
@Controller({
  version: '1',
  path: '/menu',
})
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiBearerAuth('accessToken')
  @Get('parent')
  @Serialize(MenuResponseDto)
  getMenusByParent(): Promise<MenuResponseDto[]> {
    return this.menuService.getMenusByParent();
  }

  @ApiBearerAuth('accessToken')
  @Get()
  @Serialize(MenuResponseDto)
  getMenus(): Promise<MenuResponseDto[]> {
    return this.menuService.getMenus();
  }

  @ApiBearerAuth('accessToken')
  @Get(':id')
  @Serialize(MenuResponseDto)
  getMenusById(@Param('id') id: number): Promise<MenuResponseDto> {
    return this.menuService.getMenusById(id);
  }

  @ApiBearerAuth('accessToken')
  @Put(':id')
  @Serialize(MenuResponseDto)
  updateMenu(
    @Param('id') id: number,
    @Body() data: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    return this.menuService.updateMenu(id, data);
  }

  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @Serialize(GenericResponseDto)
  deleteMenu(@Param('id') id: number): Promise<GenericResponseDto> {
    return this.menuService.deleteMenus([id]);
  }

  @ApiBearerAuth('accessToken')
  @Post()
  @Serialize(MenuResponseDto)
  createMenu(@Body() data: CreateMenuDto): Promise<MenuResponseDto> {
    return this.menuService.createMenu(data);
  }
}
