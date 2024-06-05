import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UnprocessableEntityException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register')
    async register(@Body() body: CreateUserDto): Promise<{ message: string; data: any; }> {
        const result = await this.userService.register(body)
        return {
            message: 'Successfully registered.',
            data: result
        };
    }

    @Post('/login')
    async login(@Body() body: LoginUserDto): Promise<{ message: string; data: any; }> {
        const result = await this.userService.login(body);
        return {
            message: 'Successfully login.',
            data: result
        };
    }

    @Get('/profile')
    @UseGuards(AuthGuard)
    getProfile(@Request() req) {
        return {
            message: 'success',
            data: req.user
        };
    }
}

