import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({ 
  imports: [TypeOrmModule.forFeature([Variant]), ProductsModule],
  controllers: [VariantsController],
  providers: [VariantsService],
  exports: [VariantsService]
})
export class VariantsModule {}
