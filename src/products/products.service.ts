import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { Image } from './entities/image.entity';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
    private readonly catService: CategoriesService,
  ) {}

  async create(data: CreateProductDto, files: Express.Multer.File[]) {
    const categories = !data.categories ? null : await Promise.all(
      data.categories.map(async id => {
          const category = await this.catService.findOne(id);
          return category;
      }),
    );
    const product = new Product({
      name: data.name,
      description: data.description,
      price: +data.price,
      categories: categories,
    });
    const savedProduct = await this.repo.save(product);
    if(files) {
      await this.saveImages(files, savedProduct);
    }
    return savedProduct;
  }

  async findAll() {
    const products = await this.repo.find({
      relations: ['categories', 'images']
    });
    const result = products.map(product => this.formatProductData(product));
    return result;
  }

  async getProduct(id: number) {
    const product = await this.repo.findOne({
      where: {id}, 
      relations: ['categories', 'variants', 'images'], 
    }); 
    if(!product) {
      throw new HttpException(
        { message: ['Product not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const result = this.formatProductData(product);
    return result; 
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

  async update(id: number, data: UpdateProductDto, files: Express.Multer.File[]) {
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
    if(files) {
      await this.saveImages(files, product);
    }
    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.repo.remove(product);
    return product;
  }

  async removeImage(id: number) {
    const image = await this.imageRepo.findOne({where: {id}});
    if(!image) {
      throw new HttpException(
        {message: ["Product image not found."], error: "Not found"},
        HttpStatus.NOT_FOUND,
      )
    }
    await fs.unlink(join(__dirname, '..', '..', '..', 'uploads', 'products', image.name as string))
    await this.imageRepo.remove(image);
    return null;
  }

  formatProductData(product: Product) {
    product.images = product.images.map(image => {
      image['path'] = process.env.APP_URL + `/products/${product.id}/images/` + image.name;
      return image;
    })
    return product
  }

  async saveImages(files: Express.Multer.File[], product: Product) {
    const images = files.map(file => {
      const image = new Image({
        name: file.filename,
        product: product,
      });
      return this.imageRepo.save(image);
    })
    await Promise.all(images);
  }
}
