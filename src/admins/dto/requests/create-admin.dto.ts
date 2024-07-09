import { IsEmail, IsOptional, IsString, MinLength, minLength } from "class-validator";

export class CreateAdminDto {
    @IsString({message: "Name must be at least 3 characters."})
    @MinLength(3)
    name: string;

    @IsString({message: "Please enter a valid email."})
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    image: string;

    @IsString({message: "Password must be at least 6 characters."})
    @MinLength(6)
    password: string;
}