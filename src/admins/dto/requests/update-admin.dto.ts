import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsString, MinLength } from "class-validator";
import { CreateAdminDto } from "./create-admin.dto";

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsString({message: "Please enter a valid email."})
    @IsEmail()
    @MinLength(3)
    email: string;
}