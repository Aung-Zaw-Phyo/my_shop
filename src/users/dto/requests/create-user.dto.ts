import { IsEmail, IsOptional, IsString, MinLength, minLength } from "class-validator";
import { IsUnique } from "src/common/validators/is-unique";

export class CreateUserDto {
    @IsString({message: "Name must be at least 3 characters."})
    @MinLength(2)
    name: string;

    @IsString({message: "Please enter a valid email."})
    @IsUnique({tableName: 'user', column: 'email'})
    @IsEmail()
    email: string;

    @IsOptional()
    image: Express.Multer.File;

    @IsString({message: "Password must be at least 6 characters."})
    @MinLength(6)
    password: string;
}