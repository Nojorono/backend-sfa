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
  getMenusById(@Param('id') id: string): Promise<MenuResponseDto> {
    return this.menuService.getMenusById(Number(id));
  }

  @ApiBearerAuth('accessToken')
  @Put(':id')
  @Serialize(MenuResponseDto)
  updateMenu(
    @Param('id') id: string,
    @Body() data: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    return this.menuService.updateMenu(Number(id), data);
  }

  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @Serialize(GenericResponseDto)
  deleteMenu(@Param('id') id: string): Promise<GenericResponseDto> {
    return this.menuService.deleteMenus(Number(id));
  }

  @ApiBearerAuth('accessToken')
  @Post()
  @Serialize(MenuResponseDto)
  createMenu(@Body() data: CreateMenuDto): Promise<MenuResponseDto> {
    return this.menuService.createMenu(data);
  }
}
