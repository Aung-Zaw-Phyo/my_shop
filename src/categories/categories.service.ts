import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';

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
    Object.assign(category, updateCategoryDto);
    return this.repo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.repo.delete(id);
    return category;
  }
}
