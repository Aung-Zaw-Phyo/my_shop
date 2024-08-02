import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UnprocessableEntityException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginUserDto } from './dto/requests/login-user.dto';
import { UserDto } from './dto/responses/user.dto';
import { AuthUserDto } from './dto/responses/auth-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('/')
    @Serialize(UserDto)
    getUsers() {
        return this.usersService.findAll();
    }

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
}

