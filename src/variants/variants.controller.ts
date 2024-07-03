import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  async create(@Body() createVariantDto: CreateVariantDto) {
    const result = await this.variantsService.create(createVariantDto)
    return {
      message: "Fetch variants",
      data: result,
    };
  }

  @Get()
  async findAll() {
    const result = await this.variantsService.findAll()
    return {
      message: "Variant created successfully.",
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.variantsService.findOne(+id)
    return {
      message: "Fetch variant successfully.",
      data: result,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    const result = await this.variantsService.update(+id, updateVariantDto);
    return {
      message: "Variant updated successfully.",
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.variantsService.remove(+id);
    return {
      message: "Variant deleted successfully.",
      data: result,
    };
  }
}
