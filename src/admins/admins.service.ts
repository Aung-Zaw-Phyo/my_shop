import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminCreateDto } from './dto/admin-create.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AdminsService {
    constructor(
        @InjectRepository(Admin) private repo: Repository<Admin>,
        private jwtService: JwtService
    ) {}

    async login(data: AdminLoginDto) {
        const [userFromDb] = await this.find(data.email)
        if(!userFromDb) {
            throw new HttpException(
                { message: ['Your credentials is incorrect.'], error: 'Validation Error' },
                HttpStatus.NOT_FOUND,
            );
        }
        const [salt, storedHash] = userFromDb.password.split('.');
        const hash = (await scrypt(data.password, salt, 32)) as Buffer;
        if(storedHash !== hash.toString('hex')) {
            throw new HttpException(
                { message: ['Your password is incorrect!'], error: 'Validation Error' },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
        const user = Object(userFromDb);
        delete user.password;

        const payload = { id: user.id, email: user.email };
        const access_token = await this.jwtService.signAsync(payload);

        return {
            user: user,
            token: access_token,
        }
    }

    async createAccount(data: AdminCreateDto) {
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
        const savedUser = await this.repo.save(userInstance);
        const user = Object(savedUser);
        delete user.password;

        return user;
    }

    

    findOne(id: number) {
        if(!id) {
            return null;
        }
        return this.repo.findOne({where: {id}}); 
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }
}
