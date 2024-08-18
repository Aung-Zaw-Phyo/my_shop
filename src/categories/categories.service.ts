import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { paginate, PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';
import { paginate_items_limit, paginate_max_limit } from 'src/common/constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

  async getCategories(query: PaginateQuery): Promise<Paginated<Category>> {
    const config: PaginateConfig<Category> = {
        sortableColumns: ['id', 'name'],
        maxLimit: paginate_items_limit,
        defaultSortBy: [['createdAt', 'DESC']]
    }
    query.limit = query.limit == 0 ? paginate_max_limit : query.limit;
    const result = await paginate<Category>(query, this.repo, config)
    return result;
  }


  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category({
      name: createCategoryDto.name
    });
    const result = await this.repo.save(category);
    return result;
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const category = await this.repo.findOne({where: {id}})
    if(!category) {
      throw new HttpException(
        { message: ['Category not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const existedCategory = await this.repo.findOne({where: {name: updateCategoryDto.name, id: Not(id)}});
    if(existedCategory) {
      throw new HttpException(
          { message: ['Name has already exist.'], error: 'Validation Error' },
          HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }
    Object.assign(category, updateCategoryDto);
    return this.repo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.repo.delete(id);
    return category;
  }
}
