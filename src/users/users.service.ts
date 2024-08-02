import { Injectable, Body, UnprocessableEntityException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/requests/login-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        private jwtService: JwtService
    ) {}

    
  findAll() {
    return this.repo.find();
  }

    async register(data: CreateUserDto) {
        const [userFromDb] = await this.find(data.email);
        if(userFromDb) {
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
        const token = await this.generateToken({ id: user.id, email: user.email })
        return {...user, access_token: token}
    }

    async login(data: LoginUserDto) {
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
        const token = await this.generateToken({ id: user.id, email: user.email })
        return {...user, access_token: token}
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
