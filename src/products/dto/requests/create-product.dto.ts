import { Transform } from "class-transformer";
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString({message: "Enter your valid product name."})
    @MinLength(1)
    name: string;

    @IsString({message: "Enter your valid product name."})
    @MinLength(1)
    description: string;

    @IsString()
    price: string;

    @Transform(({ value }) => { // json request data is correct ([1,2,3]). but categories ids are string in formdata (1,2,3). TO AVOID THIS
        if (typeof value === 'string') {
            return value.split(',').map(Number);
        }
        return value;
    })
    @IsArray({ message: "Categories must be an array." })
    @ArrayNotEmpty({ message: "Categories array should not be empty." })
    @ArrayMinSize(1, { message: "At least one category must be selected." })
    categories: number[];

    @IsOptional()
    images: Express.Multer.File[];
}
