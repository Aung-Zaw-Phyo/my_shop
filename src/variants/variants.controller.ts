import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/requests/create-variant.dto';
import { UpdateVariantDto } from './dto/requests/update-variant.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { VariantDto } from './dto/responses/variant.dto';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  @Serialize(VariantDto, "Variant created successfully.")
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto)
  }

  @Get()
  @Serialize(VariantDto, "Fetched variants successfully.")
  findAll() {
    return this.variantsService.findAll()
  }

  @Get(':id')
  @Serialize(VariantDto)
  findOne(@Param('id') id: string) {
    return this.variantsService.findOne(+id)
  }

  @Patch(':id')
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
