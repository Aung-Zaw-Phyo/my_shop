import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsString, MinLength } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString({message: "Please enter a valid email."})
    @IsEmail()
    @MinLength(3)
    email: string;
}