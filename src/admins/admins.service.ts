import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/requests/login-admin.dto';
import { CreateAdminDto } from './dto/requests/create-admin.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AdminsService {
    constructor(
        @InjectRepository(Admin) private repo: Repository<Admin>,
        private jwtService: JwtService
    ) {}

    async login(data: LoginAdminDto) {
        const [user] = await this.find(data.email)
        if(!user) {
            throw new HttpException(
                { message: ['Your credentials is incorrect.'], error: 'Validation Error' },
                HttpStatus.NOT_FOUND,
            );
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(data.password, salt, 32)) as Buffer;
        if(storedHash !== hash.toString('hex')) {
            throw new HttpException(
                { message: ['Your password is incorrect!'], error: 'Validation Error' },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
        const token = await this.generateToken({ id: user.id, email: user.email });
        return {...user, access_token: token};
    }   

    async createAccount(data: CreateAdminDto) {
        const existedUser = await this.repo.findOne({where: {email: data.email}});
        if(existedUser) {
            throw new HttpException(
                { message: ['Email has already been taken.'], error: 'Validation Error' },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(data.password, salt, 32)) as Buffer;
        const hashPassword = salt + "." + hash.toString('hex');

        const userInstance = this.repo.create({
            name: data.name,
            email: data.email,
            password: hashPassword
        });
        const user = await this.repo.save(userInstance);
        return user;
    }

    findOne(id: number) {
        return this.repo.findOne({where: {id}}); 
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    async generateToken(payload) {
        return this.jwtService.signAsync(payload);
    }
}
