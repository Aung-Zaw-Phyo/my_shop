import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginUserDto } from './dto/requests/login-user.dto';
import { UserDto } from './dto/responses/user.dto';
import { AuthUserDto } from './dto/responses/auth-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { User } from './entities/user.entity';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('admin/users')
@UseGuards(AdminGuard)
export class UsersAdminController {
    constructor(private usersService: UsersService) {}

    @Get('/')   
    @Serialize(UserDto)
    getUsers(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
      return this.usersService.getUsers(query);
    }

    @Get(':id')
    @Serialize(UserDto)
    getUser(@Param('id') id: string) {
      return this.usersService.findOne(+id);
    }

    @Post('/')
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads/users',
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
    @Serialize(UserDto, 'User created successfully.')
    createUser(@Body() body: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.create(body, file);
    }

    @Put('/:id')
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads/users',
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
    @Serialize(UserDto, 'User updated successfully.')
    updateUser(@Body() body: UpdateUserDto, @Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.updateUser(body, +id, file);
    }

    @Delete('/:id')
    @Serialize(UserDto, 'User updated successfully.')
    removeUser(@Param('id') id: string) {
        return this.usersService.removeUser(+id);
    }

}

