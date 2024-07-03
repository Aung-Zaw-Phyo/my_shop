import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { ProductsService } from 'src/products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant) private readonly repo: Repository<Variant>,
    private readonly productService: ProductsService
  ) {}
  async create(createVariantDto: CreateVariantDto) {
    const product = await this.productService.findOne(createVariantDto.productId);
    if(!product) {
      throw new HttpException(
        { message: ['Product not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const variant = new Variant({
      color: createVariantDto.color,
      size: createVariantDto.size,
      stock: createVariantDto.stock,
      product: product,
    });
    const result = await this.repo.save(variant);
    return result;
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const variant = await this.repo.findOne({where: {id}}); 
    if(!variant) {
      throw new HttpException(
        { message: ['Variant not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return variant; 
  }

  async update(id: number, updateVariantDto: UpdateVariantDto) {
    const variant = await this.findOne(id);
    Object.assign(variant, updateVariantDto);
    if(updateVariantDto.productId) {
      const product = await this.productService.findOne(updateVariantDto.productId);
      if(!product) {
        throw new HttpException(
          { message: ['Product not found.'], error: 'Not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      variant.product = product;
    }
    return this.repo.save(variant);
  }

  async remove(id: number) {
    const variant = await this.findOne(id);
    return this.repo.remove(variant);
  }
}
