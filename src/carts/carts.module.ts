import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UsersModule } from 'src/users/users.module';
import { VariantsModule } from 'src/variants/variants.module';
import { CartItem } from './entities/cart_item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), UsersModule, VariantsModule],
  controllers: [CartsController], 
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule {}
