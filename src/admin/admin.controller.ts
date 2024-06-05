import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dtos/admin-login.dto';
import { AdminCreateDto } from './dtos/admin-create.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Post('/login')
    async login(@Body() body: AdminLoginDto): Promise<{ message: string; data: any; }> {
        const result = await this.adminService.login(body);
        return {
            message: 'Successfully login.',
            data: result
        };
    }

    @Post('/create')
    async createAccount(@Body() body: AdminCreateDto): Promise<{ message: string; data: any; }> {
        const result = await this.adminService.createAccount(body)
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
