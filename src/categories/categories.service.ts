import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

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

  async paginate(options: IPaginationOptions): Promise<Pagination<Category>> {
    const queryBuilder = this.repo.createQueryBuilder('c');
    queryBuilder.orderBy('c.createdAt', 'DESC');

    return paginate<Category>(queryBuilder, options);
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
