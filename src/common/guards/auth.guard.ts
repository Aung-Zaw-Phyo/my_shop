import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
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
            const user = await this.usersService.findOne(payload.id);
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