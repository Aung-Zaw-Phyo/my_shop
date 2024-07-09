import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { LoginAdminDto } from './dto/requests/login-admin.dto';
import { CreateAdminDto } from './dto/requests/create-admin.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AdminDto } from './dto/responses/admin.dto';
import { AuthAdminDto } from './dto/responses/auth-admin.dto';

@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    @Post('/login')
    @Serialize(AuthAdminDto, 'Successfully login.')
    login(@Body() body: LoginAdminDto) {
        return this.adminsService.login(body);
    }

    @Post('/create')
    @Serialize(AdminDto, 'Successfully created.')
    createAccount(@Body() body: CreateAdminDto) {
        return this.adminsService.createAccount(body)
    }

    @Get('/profile')
    @UseGuards(AdminGuard)
    @Serialize(AdminDto)
    getProfile(@Request() req): { message: string; data: any; } {
        return req.user
    }
}
