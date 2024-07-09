import { IsArray, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString({message: "Enter your valid product name."})
    @MinLength(1)
    name: string;

    @IsString({message: "Enter your valid product name."})
    @MinLength(1)
    description: string;

    @IsNumber()
    price: number;

    @IsArray()
    categories: number[];
}
