import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CategoryDto } from './dto/responses/category.dto';
import { Category } from './entities/category.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Serialize(CategoryDto, "Categories fetched successfully.")
  getCategories(@Paginate() query: PaginateQuery): Promise<Paginated<Category>> {
    return this.categoriesService.getCategories(query);
  }

  @Get(':id')
  @Serialize(CategoryDto)
  getCategory(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }
}
