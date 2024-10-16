import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { UsersModule } from 'src/users/users.module';
import { VariantsModule } from 'src/variants/variants.module';
import { CartsModule } from 'src/carts/carts.module';
import { AdminsModule } from 'src/admins/admins.module';
import { OrdersAdminController } from './orders-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), UsersModule, AdminsModule, CartsModule, VariantsModule],
  controllers: [OrdersController, OrdersAdminController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
