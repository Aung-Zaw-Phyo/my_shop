import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CategoryDto } from './dto/responses/category.dto';
import { Category } from './entities/category.entity';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('admin/categories')
@UseGuards(AdminGuard)
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Serialize(CategoryDto, "Category created successfully.")
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
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Serialize(CategoryDto, "Category deleted successfully.")
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
