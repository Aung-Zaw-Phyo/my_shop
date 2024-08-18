import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginUserDto } from './dto/requests/login-user.dto';
import { UserDto } from './dto/responses/user.dto';
import { AuthUserDto } from './dto/responses/auth-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { paginate_items_limit } from 'src/common/constants';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/register')
    @Serialize(AuthUserDto, 'Successfully registered.')
    register(@Body() body: CreateUserDto) {
        return this.usersService.register(body)
    }

    @Post('/login')
    @Serialize(AuthUserDto, 'Successfully login.')
    login(@Body() body: LoginUserDto) {
        return this.usersService.login(body);
    }

    @Get('/profile')
    @UseGuards(AuthGuard)
    @Serialize(UserDto, 'Successfully fetch profile data.')
    getProfile(@Request() req) {
        return req.user;
    }

    @Put('/')
    @UseGuards(AuthGuard)
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
    @Serialize(UserDto, 'Profile updated successfully.')
    update(@Body() body: UpdateUserDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.update(body, req.user, file);
    }


    // admin

    @Get('/')   
    @Serialize(UserDto)
    @UseGuards(AdminGuard)
    getUsers(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
      return this.usersService.getUsers(query);
    }

    @Get(':id')
    @Serialize(UserDto)
    @UseGuards(AdminGuard)
    getUser(@Param('id') id: string) {
      return this.usersService.findOne(+id);
    }

    @Post('/')
    @UseGuards(AdminGuard)
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
    @UseGuards(AdminGuard)
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
    @UseGuards(AdminGuard)
    @Serialize(UserDto, 'User updated successfully.')
    removeUser(@Param('id') id: string) {
        return this.usersService.removeUser(+id);
    }

}

