import { IsNumber, IsString, MinLength, Validate } from "class-validator";

export class CreateVariantDto {
    @IsString({message: "Enter valid variant color."})
    @MinLength(1)
    color: string;

    @IsString({message: "Enter valid variant size."})
    @MinLength(1)
    size: string;

    @IsNumber()
    stock: number;

    @IsNumber()
    productId: number;
}
