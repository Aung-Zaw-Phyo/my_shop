import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UploadedFiles, UseInterceptors, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProductDto } from './dto/responses/product.dto';
import { extname, join } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
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
  @Serialize(ProductDto, "Product created successfully.")
  create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.productsService.create(createProductDto, files);
  }

  @Get()
  @Serialize(ProductDto, "Fetch products successfully.")
  getProducts() {
    return this.productsService.findAll();
  }

  @Get(':id/images/:image_name')
  getImage(@Param('image_name') image_name: string, @Res() res) {
    const result = join(process.cwd(), 'uploads/products/' + image_name);
    return res.sendFile(result);
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
