import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { CartsModule } from 'src/carts/carts.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [UsersModule, CartsModule, OrdersModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
