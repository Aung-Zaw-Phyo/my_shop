import { IsNumber, IsString, MinLength, Validate } from "class-validator";
import { IsProductExists } from "../validator/is-product-exists.validator";

export class CreateVariantDto {
    @IsString({message: "Enter valid variant color."})
    @MinLength(1)
    color: string;

    @IsString({message: "Enter valid variant size."})
    @MinLength(1)
    size: string;

    @IsNumber()
    stock: number;

    // @Validate(IsProductExists, { message: 'Product ID does not exist.' })
    @IsNumber()
    productId: number;
}
