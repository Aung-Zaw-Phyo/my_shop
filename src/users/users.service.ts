import { Injectable } from '@nestjs/common';
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
import { generatePassword, removeImage, throwValidationError } from 'src/common/helper';

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
            throwValidationError('Your credentials is incorrect.');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(loginUserDto.password, salt, 32)) as Buffer;
        if(storedHash !== hash.toString('hex')) {
            throwValidationError('Your password is incorrect!');
        }
        const token = await this.generateToken({ id: user.id, email: user.email })
        return {...user, access_token: token}
    }

    async update(updateUserDto: UpdateUserDto, user: User, file: Express.Multer.File) {
        if(updateUserDto.email) {
            const existedUser = await this.repo.findOne({where: {email: updateUserDto.email, id: Not(user.id)}});
            if(existedUser) {
                throwValidationError('Email has already exist.');
            }
        }
        Object.assign(user, updateUserDto);
        if(file) {
            await removeImage('users', user.image);
            user.image = file.filename;
        }
        return this.repo.save(user);
    }

    async findOne(id: number) {
        const user = await this.repo.findOne({where: {id}}); 
        if(!user) {
            throwValidationError('User not found.');
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
        const hashPassword = await generatePassword(createUserDto.password)
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
                throwValidationError('Email has already exist.');
            }
        }
        if(!updateUserDto.password) {
            updateUserDto.password = user.password
        }
        if(file && user.image) {
            await removeImage('users', user.image);
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
            await removeImage('users', user.image);
        }
        await this.repo.remove(user);
        return user;
    }

    async generateToken(payload) {
        return this.jwtService.signAsync(payload);
    }
}
