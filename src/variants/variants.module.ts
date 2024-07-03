import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { ProductsModule } from 'src/products/products.module';
import { IsProductExists } from './validator/is-product-exists.validator';

@Module({ 
  imports: [TypeOrmModule.forFeature([Variant]), ProductsModule],
  controllers: [VariantsController],
  providers: [VariantsService, IsProductExists],
})
export class VariantsModule {}
