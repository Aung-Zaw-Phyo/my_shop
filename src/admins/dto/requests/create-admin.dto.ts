import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { IsUnique } from "src/common/validators/is-unique";

export class CreateAdminDto {
    @IsString({message: "Name must be at least 3 characters."})
    @MinLength(3)
    name: string;

    @IsString({message: "Please enter a valid email."})
    @IsUnique({tableName: 'admin', column: 'email'})
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    image: string;

    @IsString({message: "Password must be at least 6 characters."})
    @MinLength(6)
    password: string;
}