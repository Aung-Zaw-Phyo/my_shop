import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/requests/create-variant.dto';
import { UpdateVariantDto } from './dto/requests/update-variant.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { VariantDto } from './dto/responses/variant.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Variant } from './entities/variant.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('admin/variants')
@UseGuards(AdminGuard)
export class VariantsAdminController {
  constructor(private readonly variantsService: VariantsService) {}
  @Get()
  @Serialize(VariantDto, "Fetched variants successfully.")
  getVariants(@Paginate() query: PaginateQuery): Promise<Paginated<Variant>> {
    return this.variantsService.getVariants(query);
  }

  @Get(':id')
  @Serialize(VariantDto)
  getVariant(@Param('id') id: string) {
    return this.variantsService.findOne(+id);
  }


  @Post()
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
