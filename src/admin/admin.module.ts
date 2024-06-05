import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]), 
    JwtModule.register({
      global: true,
      secret: 'my_secret',
      signOptions: { expiresIn: '3600s' },
    })
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
