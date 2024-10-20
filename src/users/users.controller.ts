import { Body, Controller, Get, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginUserDto } from './dto/requests/login-user.dto';
import { UserDto } from './dto/responses/user.dto';
import { AuthUserDto } from './dto/responses/auth-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
}

