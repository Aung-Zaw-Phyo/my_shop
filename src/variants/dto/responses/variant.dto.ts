import { Expose, Type } from "class-transformer";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { ProductDto } from "src/products/dto/responses/product.dto";

export class VariantDto extends AbstractDto {
    @Expose()
    id: number;

    @Expose()
    color: string;

    @Expose()
    size: string;

    @Expose()
    stock: number;

    @Expose()
    @Type(() => ProductDto)
    product?: ProductDto; 
}