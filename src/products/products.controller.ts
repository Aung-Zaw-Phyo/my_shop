import { Controller, Get, Param, } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProductDto } from './dto/responses/product.dto';
import { Product } from './entities/product.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Serialize(ProductDto, "Fetch products successfully.")
  getProducts(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    return this.productsService.getProducts(query);
  }

  @Get(':id')
  @Serialize(ProductDto, "Fetch product successfully.")
  getProduct(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
