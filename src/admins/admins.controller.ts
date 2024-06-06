import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminCreateDto } from './dto/admin-create.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('admin')
export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    @Post('/login')
    async login(@Body() body: AdminLoginDto): Promise<{ message: string; data: any; }> {
        const result = await this.adminsService.login(body);
        return {
            message: 'Successfully login.',
            data: result
        };
    }

    @Post('/create')
    async createAccount(@Body() body: AdminCreateDto): Promise<{ message: string; data: any; }> {
        const result = await this.adminsService.createAccount(body)
        return {
            message: 'Successfully created.',
            data: result
        };
    }

    @Get('/profile')
    @UseGuards(AdminGuard)
    getProfile(@Request() req): { message: string; data: any; } {
        return {
            message: 'success',
            data: req.user
        };
    }
}
