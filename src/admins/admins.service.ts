import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { Admin } from './entities/admin.entity';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/requests/login-admin.dto';
import { CreateAdminDto } from './dto/requests/create-admin.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { generatePassword, removeImage, throwValidationError } from 'src/common/helper';
import { UpdateAdminDto } from './dto/requests/update-admin.dto';

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

    async findOne(id: number) {
        const admin = await this.repo.findOne({where: {id}}); 
        if(!admin) {
            throwValidationError('Admin not found.');
        }
        return admin;
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Admin>> {
        const queryBuilder = this.repo.createQueryBuilder('c');
        queryBuilder.orderBy('c.createdAt', 'DESC');

        return paginate<Admin>(queryBuilder, options);
    }

    async create(createAdminDto: CreateAdminDto, file: Express.Multer.File) {
        const hashPassword = await generatePassword(createAdminDto.password)
        let fileName = null;
        if(file) {
            fileName = file.filename;
        }
        const adminInstance = this.repo.create({
            name: createAdminDto.name,
            email: createAdminDto.email,
            image: fileName,
            password: hashPassword
        });
        const admin = await this.repo.save(adminInstance);
        return admin;
    }

    async update(updateAdminDto: UpdateAdminDto, id: number, file: Express.Multer.File) {
        const admin = await this.findOne(id);
        if(updateAdminDto.email) {
            const existedAdmin = await this.repo.findOne({where: {email: updateAdminDto.email, id: Not(id)}});
            if(existedAdmin) {
                throwValidationError('Email has already exist.');
            }
        }
        if(updateAdminDto.password) {
            updateAdminDto.password = await generatePassword(updateAdminDto.password)
        }else {
            updateAdminDto.password = admin.password
        }
        if(file && admin.image) {
            await removeImage('admins', admin.image);
        }
        Object.assign(admin, updateAdminDto);
        if(file) {
            admin.image = file.filename;
        }
        return this.repo.save(admin);
    }

    async remove(id: number) {
        const admin = await this.findOne(id);
        if(admin.image) {
            await removeImage('admins', admin.image);
        }
        await this.repo.remove(admin);
        return admin;
    }



    async generateToken(payload) {
        return this.jwtService.signAsync(payload);
    }
}
