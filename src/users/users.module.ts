import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from 'src/admins/admins.module';
import { UsersAdminController } from './users-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    JwtModule.register({
      global: true,
      secret: 'my_secret',
      signOptions: { expiresIn: '30d' },
    }),
    AdminsModule,
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
