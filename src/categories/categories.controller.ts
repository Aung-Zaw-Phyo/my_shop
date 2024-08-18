import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CategoryDto } from './dto/responses/category.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './entities/category.entity';
import { paginate_items_limit } from 'src/common/constants';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Serialize(CategoryDto, "Category created successfully.")
  @UseGuards(AdminGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

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

  @Put(':id')
  @Serialize(CategoryDto, "Category updated successfully.")
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Serialize(CategoryDto, "Category deleted successfully.")
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
