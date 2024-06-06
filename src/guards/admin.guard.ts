import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AdminsService } from "src/admins/admins.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService, private adminsService: AdminsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            // throw new UnauthorizedException();
            throw new HttpException(
                { message: ['Unauthenticated'], error: 'Unauthenticated' },
                HttpStatus.UNAUTHORIZED,
            );
        }
        try {
            const payload = await this.jwtService.verifyAsync(
              token,
              {
                secret: 'my_secret'
              }
            );
            const user = await this.adminsService.findOne(payload.id);
            if (!user) {
                throw new HttpException(
                    { message: ['Unauthenticated'], error: 'Unauthenticated' },
                    HttpStatus.UNAUTHORIZED,
                );
            }
            request['user'] = user;
        } catch {
            throw new HttpException(
                { message: ['Unauthenticated'], error: 'Unauthenticated' },
                HttpStatus.UNAUTHORIZED,
            );
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}