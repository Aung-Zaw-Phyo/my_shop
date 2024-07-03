import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    private readonly catService: CategoriesService,
  ) {}

  async create(data: CreateProductDto) {
    const categories = await Promise.all(
      data.categories.map(async id => {
          const category = await this.catService.findOne(id);
          return category;
      }),
    );
    const product = new Product({
      name: data.name,
      description: data.description,
      price: data.price,
      categories: categories,
    });
    const result = await this.repo.save(product);
    return result;
  }

  findAll() {
    return this.repo.find({
      relations: ['categories']
    });
  }

  async getProduct(id: number) {
    const product = await this.findOne(id);
    if(!product) {
      throw new HttpException(
        { message: ['Product not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return product; 
  }

  findOne(id: number) {
    if(!id) {
      return null;
    }
    return this.repo.findOne({where: {id}, relations: ['categories']}); 
  }

  async update(id: number, data: UpdateProductDto) {
    const product = await this.findOne(id);
    if(!product) {
      throw new HttpException(
        { message: ['Product not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    Object.assign(product, data);
    if(data.categories) {
      const categories = await Promise.all(
        data.categories.map(async id => {
            const category = await this.catService.findOne(id);
            return category;
        }),
      );
      product.categories = categories;
    }
    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if(!product){
      throw new HttpException(
        { message: ['Product not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.repo.remove(product);
  }
}
