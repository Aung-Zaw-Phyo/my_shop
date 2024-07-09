import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';

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
    const product = await this.repo.findOne({
      where: {id}, 
      relations: ['categories', 'variants'], 
    }); 
    if(!product) {
      throw new HttpException(
        { message: ['Product not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return product; 
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({where: {id: id}});
    if(!product) {
      throw new HttpException(
        { message: ['Product not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    const product = await this.findOne(id);
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
    await this.repo.remove(product);
    return product;
  }
}
