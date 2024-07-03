import { IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString({message: "Enter your valid category name."})
    @MinLength(1)
    name: string;
}
