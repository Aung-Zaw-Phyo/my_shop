import { Expose, Type } from "class-transformer";
import { CategoryDto } from "src/categories/dto/responses/category.dto";
import { Category } from "src/categories/entities/category.entity";
import { VariantDto } from "src/variants/dto/responses/variant.dto";
import { Variant } from "src/variants/entities/variant.entity";

export class ProductDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    price: number;

    @Expose()
    @Type(() => CategoryDto)
    categories?: CategoryDto[]; 

    @Expose()
    @Type(() => VariantDto)
    variants?: VariantDto[];
    
}