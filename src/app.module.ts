import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { APP_PIPE } from '@nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            database: "my_shop",
            password: "",
            synchronize: true,
            logging: true,
            entities: [User],
            subscribers: [],
            migrations: [],
        }),
        AdminModule, 
        UserModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
    ],
})
export class AppModule {}
