import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { Image } from './entities/image.entity';
import { unlinkImage } from 'src/common/helper';
import { paginate, PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';
import { paginate_items_limit, paginate_max_limit } from 'src/common/constants';

export class CustomPaginationMeta {
    constructor(
        public readonly totalItems: number,
        public readonly itemCount: number,
        public readonly itemsPerPage: number,
        public readonly totalPages: number,
        public readonly currentPage: number,
    ) {}
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
    private readonly catService: CategoriesService,
  ) {}

    async getProducts(query: PaginateQuery): Promise<Paginated<Product>> {
        const config: PaginateConfig<Product> = {
            relations: ['categories', 'variants', 'images'],
            sortableColumns: ['id', 'name'],
            maxLimit: paginate_max_limit,
            defaultLimit: paginate_items_limit,
            defaultSortBy: [['createdAt', 'DESC']]
        }
        query.limit = query.limit == 0 ? paginate_max_limit : query.limit;
        const result = await paginate<Product>(query, this.repo, config)
        return result;
    }

    async findOne(id: number) {
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
        return product; 
    }

    async create(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
        const categories = !createProductDto.categories ? null : await Promise.all(
            createProductDto.categories.map(async id => {
                const category = await this.catService.findOne(id);
                return category;
            }),
        );
        const product = new Product({
            name: createProductDto.name,
            description: createProductDto.description,
            price: +createProductDto.price,
            categories: categories,
        });
        const savedProduct = await this.repo.save(product);
        if(files) {
            await this.saveImages(files, savedProduct);
        }
        return savedProduct;
    }

    async update(id: number, updateProductDto: UpdateProductDto, files: Express.Multer.File[]) {
        const product = await this.findOne(id);
        if(files.length > 0) {
            await this.removeImages(product.images);
        }
        Object.assign(product, updateProductDto);
        if(updateProductDto.categories) {
            const categories = await Promise.all(
                updateProductDto.categories.map(async id => {
                    const category = await this.catService.findOne(id);
                    return category;
                }),
            );
            product.categories = categories;
        }
        const updatedProduct = await this.repo.save(product);
        if(files.length > 0) {
            await this.saveImages(files, updatedProduct);
        }
        return updatedProduct;
    }

    async remove(id: number) {
        const product = await this.findOne(id);
        await product.images.map(async (image) => {
            await unlinkImage('products', image.name as string);
        })
        await this.repo.remove(product);
        return product;
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

    async removeImages(images: Image[]) {
        images.map(async (img) => {
            await unlinkImage('products', img.name as string);
            const image = await this.imageRepo.findOne({where: {id: img.id}});
            await this.imageRepo.remove(image);
        });
    }
}
