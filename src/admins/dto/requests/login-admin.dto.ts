import { IsEmail, IsOptional, IsString, MinLength, minLength } from "class-validator";

export class LoginAdminDto {
    @IsString({message: "Please enter a valid email."})
    @IsEmail()
    email: string;

    @IsString({message: "Password must be at least 6 characters."})
    @MinLength(6)
    password: string;
}