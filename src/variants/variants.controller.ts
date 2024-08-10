import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, DefaultValuePipe, UseGuards, Put } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/requests/create-variant.dto';
import { UpdateVariantDto } from './dto/requests/update-variant.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { VariantDto } from './dto/responses/variant.dto';
import { paginate_items_limit } from 'src/common/constants';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Variant } from './entities/variant.entity';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}
  @Get()
  @UseGuards(AdminGuard)
  @Serialize(VariantDto, "Fetched variants successfully.")
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(paginate_items_limit), ParseIntPipe) limit: number = paginate_items_limit,
  ): Promise<Pagination<Variant>> {
    limit = limit > 100 ? 100 : limit;
    return this.variantsService.paginate({
      page,
      limit,
      route: process.env.APP_URL + '/variants',
    });
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @Serialize(VariantDto)
  getCategory(@Param('id') id: string) {
    return this.variantsService.findOne(+id);
  }


  @Post()
  @UseGuards(AdminGuard)
  @Serialize(VariantDto, "Variant created successfully.")
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto)
  }

  @Put(':id')
  @Serialize(VariantDto, "Variant updated successfully.")
  update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantsService.update(+id, updateVariantDto);
  }

  @Delete(':id')
  @Serialize(VariantDto, "Variant deleted successfully.")
  remove(@Param('id') id: string) {
    return this.variantsService.remove(+id);
  }
}
