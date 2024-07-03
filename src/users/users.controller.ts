import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UnprocessableEntityException, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/register')
    async register(@Body() body: CreateUserDto): Promise<ApiResponse<any>> {
        const result = await this.usersService.register(body)
        return {
            message: 'Successfully registered.',
            data: result
        };
    }

    @Post('/login')
    async login(@Body() body: LoginUserDto): Promise<ApiResponse<any>> {
        const result = await this.usersService.login(body);
        return {
            message: 'Successfully login.',
            data: result
        };
    }

    @Get('/profile')
    @UseGuards(AuthGuard)
    async getProfile(@Request() req): Promise<ApiResponse<any>> {
        return {
            message: 'success',
            data: req.user
        };
    }
}

