import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { AdminsModule } from 'src/admins/admins.module';
import { CategoriesAdminController } from './categories-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AdminsModule], 
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
