import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CategoryDto } from './dto/responses/category.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './entities/category.entity';
import { paginate_items_limit } from 'src/common/constants';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Serialize(CategoryDto, "Category created successfully.")
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Serialize(CategoryDto, "Categories fetched successfully.")
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(paginate_items_limit), ParseIntPipe) limit: number = paginate_items_limit,
  ): Promise<Pagination<Category>> {
    limit = limit > 100 ? 100 : limit;
    return this.categoriesService.paginate({
      page,
      limit,
      route: process.env.APP_URL + '/categories',
    });
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
