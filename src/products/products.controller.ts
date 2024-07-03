import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const result = await this.productsService.create(createProductDto);
    return {
      message: "Product created successfully.",
      data: {
        product: result
      }
    }
  }

  @Get()
  async getProducts() {
    const result = await this.productsService.findAll();
    return {
      message: "Fetch products successfully.",
      data: result
    }
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const result = await this.productsService.getProduct(+id);
    return {
      message: "Fetch product successfully.",
      data: result,
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const result = await this.productsService.update(+id, updateProductDto);
    return {
      message: "Product updated successfully.",
      data: result
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
