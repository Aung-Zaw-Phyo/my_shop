import { IsEmail, IsOptional, IsString, MinLength, minLength } from "class-validator";

export class LoginUserDto {
    @IsString({message: "Please enter a valid email."})
    @IsEmail()
    email: string;

    @IsString({message: "Password must be at least 6 characters."})
    @MinLength(6)
    password: string;
}