import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';
import { CartsModule } from './carts/carts.module';
import { IsUniqueConstraint } from './common/validators/is-unique';
import { OrdersModule } from './orders/orders.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        DatabaseModule,
        AdminsModule, 
        UsersModule, 
        CategoriesModule, 
        ProductsModule, 
        VariantsModule, 
        CartsModule, 
        OrdersModule, 
        StripeModule, 
    ],
    controllers: [AppController],
    providers: [
        AppService,
        IsUniqueConstraint,
    ],
})
export class AppModule {}
