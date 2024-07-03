import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { EntityManager, Repository } from 'typeorm';

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

  async getCategory(id: number) {
    const category = await this.repo.findOne({
      where: {id},
      relations: ['products']
    })
    if(!category) {
      throw new HttpException(
        { message: ['Category not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {id},
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.repo.save(category);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
