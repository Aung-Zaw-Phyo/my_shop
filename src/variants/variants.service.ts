import { Injectable } from '@nestjs/common';
import { CreateVariantDto } from './dto/requests/create-variant.dto';
import { UpdateVariantDto } from './dto/requests/update-variant.dto';
import { ProductsService } from 'src/products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { throwValidationError } from 'src/common/helper';

@Injectable()
export class VariantsService {
    constructor(
        @InjectRepository(Variant) private readonly repo: Repository<Variant>,
        private readonly productService: ProductsService
    ) {}

    async paginate(options: IPaginationOptions): Promise<Pagination<Variant>> {
        const queryBuilder = this.repo.createQueryBuilder('c');
        queryBuilder
            .leftJoinAndSelect('c.product', 'product')
            .groupBy('c.id')
            .orderBy('c.createdAt', 'DESC');

        return paginate<Variant>(queryBuilder, options);
    }

    async findOne(id: number) {
        const variant = await this.repo.findOne({where: {id}, relations: ['product']}); 
        if(!variant) {
            throwValidationError('Variant not found');
        }
        return variant; 
    }

    async create(createVariantDto: CreateVariantDto) {
        const product = await this.productService.findOne(createVariantDto.productId);

        const variant = new Variant({
            color: createVariantDto.color,
            size: createVariantDto.size,
            stock: createVariantDto.stock,
            product: product,
        });
        const result = await this.repo.save(variant);
        return result;
    }

    async update(id: number, updateVariantDto: UpdateVariantDto) {
        const variant = await this.findOne(id);
        Object.assign(variant, updateVariantDto);
        if(updateVariantDto.productId) {
            const product = await this.productService.findOne(updateVariantDto.productId);
            variant.product = product;
        }
        return this.repo.save(variant);
    }

    async remove(id: number) {
        const variant = await this.findOne(id);
        await this.repo.remove(variant);
        return variant;
    }


    async reduceStock(variant: Variant, quantity: number) {
        if(variant.stock - quantity < 0) {
            throwValidationError('Product is not enough.')
        }
        variant.stock = variant.stock - quantity;
        await this.repo.save(variant);
    }

    async addStock(variant: Variant, quantity: number) {
        variant.stock = variant.stock + quantity;
        await this.repo.save(variant);
    }
}
