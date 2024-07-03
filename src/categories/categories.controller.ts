import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoriesService.create(createCategoryDto);
    return {
      message: "Category created successfully.",
      data: {
        category: result
      }
    }
  }

  @Get()
  async findAll() {
    const result = await this.categoriesService.findAll();
    return {
      message: "Categories.",
      data: {
        categories: result
      }
    }
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    const result = await this.categoriesService.getCategory(+id);
    return {
      message: "Category.",
      data: {
        category: result
      }
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoriesService.update(+id, updateCategoryDto);
    return {
      message: "Category updated successfully.",
      data: {
        category: result
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(+id);
    return {
      message: "Category deleted successfully.",
      data: null
    }
  }
}
