import { Transform } from "class-transformer";
import { IsNumber, IsString, MinLength, Validate } from "class-validator";

export class CreateVariantDto {
    @IsString({message: "Enter valid variant color."})
    @MinLength(1)
    color: string;

    @IsString({message: "Enter valid variant size."})
    @MinLength(1)
    size: string;

    @Transform(({value}) => typeof value === 'string' ? Number(value) : value)
    @IsNumber()
    stock: number;

    @Transform(({value}) => typeof value === 'string' ? Number(value) : value)
    @IsNumber()
    productId: number;
}
