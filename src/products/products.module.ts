import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { Image } from './entities/image.entity';
import { AdminsModule } from 'src/admins/admins.module';
import { ProductsAdminController } from './products-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Image]), AdminsModule, CategoriesModule],
  controllers: [ProductsController, ProductsAdminController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
