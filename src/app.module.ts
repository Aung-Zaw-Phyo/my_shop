import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        // TypeOrmModule.forRoot({
        //     type: "mysql",
        //     host: "127.0.0.1",
        //     port: 3306,
        //     username: "root",
        //     database: "my_shop",
        //     password: "",
        //     synchronize: true,
        //     logging: true,
        //     entities: [User, Admin],
        //     subscribers: [],
        //     migrations: [],
        // }),
        DatabaseModule,
        AdminsModule, 
        UsersModule, 
        CategoriesModule, 
    ],
    controllers: [AppController],
    providers: [
        AppService,
    ],
})
export class AppModule {}
