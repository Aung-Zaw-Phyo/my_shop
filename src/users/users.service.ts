import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/requests/login-user.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { promises as fs } from 'fs';
import { join } from 'path';

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

    async register(createUserDto: CreateUserDto) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
        const hashPassword = salt + "." + hash.toString('hex');

        const userInstance = this.repo.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashPassword
        });
        const savedUser = await this.repo.save(userInstance);
        const user = Object(savedUser);
        delete user.password;
        const token = await this.generateToken({ id: user.id, email: user.email })
        return {...user, access_token: token}
    }

    async login(loginUserDto: LoginUserDto) {
        const [user] = await this.find(loginUserDto.email)
        if(!user) {
            throw new HttpException(
                { message: ['Your credentials is incorrect.'], error: 'Validation Error' },
                HttpStatus.NOT_FOUND,
            );
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(loginUserDto.password, salt, 32)) as Buffer;
        if(storedHash !== hash.toString('hex')) {
            throw new HttpException(
                { message: ['Your password is incorrect!'], error: 'Validation Error' },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
        const token = await this.generateToken({ id: user.id, email: user.email })
        return {...user, access_token: token}
    }

    async update(updateUserDto: UpdateUserDto, user: User, file: Express.Multer.File) {
        if(updateUserDto.email) {
            const existedUser = await this.repo.findOne({where: {email: updateUserDto.email, id: Not(user.id)}});
            if(existedUser) {
                throw new HttpException(
                    { message: ['Email has already exist.'], error: 'Validation Error' },
                    HttpStatus.UNPROCESSABLE_ENTITY,
                );
            }
        }
        Object.assign(user, updateUserDto);
        if(file) {
            await fs.unlink(join(__dirname, '..', '..', '..', 'uploads', 'users', user.image as string))
            user.image = file.filename;
        }
        return this.repo.save(user);
    }

    async findOne(id: number) {
        const user = await this.repo.findOne({where: {id}}); 
        if(!user) {
          throw new HttpException(
            { message: ['User not found.'], error: 'Not found' },
            HttpStatus.NOT_FOUND,
          );
        }
        return user;
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    // admin
    
    async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
        const queryBuilder = this.repo.createQueryBuilder('c');
        queryBuilder.orderBy('c.createdAt', 'DESC');

        return paginate<User>(queryBuilder, options);
    }

    async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
        const hashPassword = await this.generatePassword(createUserDto.password)
        let fileName = null;
        if(file) {
            fileName = file.filename;
        }
        const userInstance = this.repo.create({
            name: createUserDto.name,
            email: createUserDto.email,
            image: fileName,
            password: hashPassword
        });
        const user = await this.repo.save(userInstance);
        return user;
    }

    async updateUser(updateUserDto: UpdateUserDto, id: number, file: Express.Multer.File) {
        const user = await this.findOne(id);
        if(updateUserDto.email) {
            const existedUser = await this.repo.findOne({where: {email: updateUserDto.email, id: Not(id)}});
            if(existedUser) {
                throw new HttpException(
                    { message: ['Email has already exist.'], error: 'Validation Error' },
                    HttpStatus.UNPROCESSABLE_ENTITY,
                );
            }
        }
        if(!updateUserDto.password) {
            updateUserDto.password = user.password
        }
        if(file && user.image) {
            await fs.unlink(join(__dirname, '..', '..', '..', 'uploads', 'users', user.image as string))
        }
        Object.assign(user, updateUserDto);
        if(file) {
            user.image = file.filename;
        }
        return this.repo.save(user);
    }

    async removeUser(id: number) {
        const user = await this.findOne(id);
        if(user.image) {
            await fs.unlink(join(__dirname, '..', '..', '..', 'uploads', 'users', user.image as string))
        }
        await this.repo.remove(user);
        return user;
    }



    // utils

    async generateToken(payload) {
        return this.jwtService.signAsync(payload);
    }

    async generatePassword(plainPassword: string) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(plainPassword, salt, 32)) as Buffer;
        const hashPassword = salt + "." + hash.toString('hex');
        return hashPassword;
    }
}
