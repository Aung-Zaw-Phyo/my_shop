import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { ProductsModule } from 'src/products/products.module';
import { AdminsModule } from 'src/admins/admins.module';
import { VariantsAdminController } from './variants-admin.controller';

@Module({ 
  imports: [TypeOrmModule.forFeature([Variant]), AdminsModule, ProductsModule],
  controllers: [VariantsController, VariantsAdminController],
  providers: [VariantsService],
  exports: [VariantsService]
})
export class VariantsModule {}
