import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsController } from './cart_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart_item.entity';
import { UsersModule } from 'src/users/users.module';
import { CartsModule } from 'src/carts/carts.module';
import { VariantsModule } from 'src/variants/variants.module';
import { CheckVariantRule } from '../variants/rules/check-vairant.rule';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), UsersModule, CartsModule, VariantsModule],
  controllers: [CartItemsController],
  providers: [CartItemsService],
})
export class CartItemsModule {}
