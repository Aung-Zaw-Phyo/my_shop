import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { LoginAdminDto } from './dto/requests/login-admin.dto';
import { CreateAdminDto } from './dto/requests/create-admin.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AdminDto } from './dto/responses/admin.dto';
import { AuthAdminDto } from './dto/responses/auth-admin.dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { paginate_items_limit } from 'src/common/constants';
import { Admin } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/requests/update-admin.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    @Post('/login')
    @Serialize(AuthAdminDto, 'Successfully login.')
    login(@Body() body: LoginAdminDto) {
        return this.adminsService.login(body);
    }

    @Get('/profile')
    @UseGuards(AdminGuard)
    @Serialize(AdminDto)
    getProfile(@Request() req){
        return req.user
    }

    @Get('/')   
    @Serialize(AdminDto)
    @UseGuards(AdminGuard)
    getAdmins(@Paginate() query: PaginateQuery): Promise<Paginated<Admin>> {
      return this.adminsService.getAdmins(query);
    }

    @Get(':id')
    @UseGuards(AdminGuard)
    @Serialize(AdminDto)
    getAdmin(@Param('id') id: string) {
      return this.adminsService.findOne(+id);
    }

    @Post('/')
    @UseGuards(AdminGuard)
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads/admins',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
    )
    @Serialize(AdminDto, 'Admin created successfully.')
    create(@Body() body: CreateAdminDto, @UploadedFile() file: Express.Multer.File) {
        return this.adminsService.create(body, file);
    }

    @Put('/:id')
    @UseGuards(AdminGuard)
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads/admins',
            filename: (req, file, cb) => {
              const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
              cb(null, `${randomName}${extname(file.originalname)}`);
            },
          }),
        }),
    )
    @Serialize(AdminDto, 'Admin updated successfully.')
    update(@Body() body: UpdateAdminDto, @Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.adminsService.update(body, +id, file);
    }

    @Delete('/:id')
    @UseGuards(AdminGuard)
    @Serialize(AdminDto, 'Admin updated successfully.')
    remove(@Param('id') id: string) {
        return this.adminsService.remove(+id);
    }

}
