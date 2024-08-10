import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UploadedFiles, UseInterceptors, Res, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProductDto } from './dto/responses/product.dto';
import { extname, join } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { paginate_items_limit } from 'src/common/constants';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Serialize(ProductDto, "Fetch products successfully.")
  getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(paginate_items_limit), ParseIntPipe) limit: number = paginate_items_limit,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productsService.paginate({
      page,
      limit,
      route: process.env.APP_URL + '/products',
    });
  }

  @Get(':id')
  @Serialize(ProductDto, "Fetch product successfully.")
  getProduct(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 8, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UseGuards(AdminGuard)
  @Serialize(ProductDto, "Product created successfully.")
  create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.productsService.create(createProductDto, files);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 8, {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }) 
  }))
  @Serialize(ProductDto, "Product updated successfully.")
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.productsService.update(+id, updateProductDto, files);
  }

  @Delete(':id')
  @Serialize(ProductDto, "Product deleted successfully.")
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
