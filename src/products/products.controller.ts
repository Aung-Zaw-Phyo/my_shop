import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProductDto } from './dto/responses/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Serialize(ProductDto, "Product created successfully.")
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Serialize(ProductDto, "Fetch products successfully.")
  getProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Serialize(ProductDto, "Fetch product successfully.")
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(+id);
  }

  @Put(':id')
  @Serialize(ProductDto, "Product updated successfully.")
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Serialize(ProductDto, "Product deleted successfully.")
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
