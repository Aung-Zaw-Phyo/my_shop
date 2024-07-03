import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
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
  providers: [AdminsService],
  controllers: [AdminsController]
})
export class AdminsModule {}