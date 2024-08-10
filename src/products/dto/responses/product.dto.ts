import { Expose, Transform, Type } from "class-transformer";
import { CategoryDto } from "src/categories/dto/responses/category.dto";
import { VariantDto } from "src/variants/dto/responses/variant.dto";
import { ImageDto } from "./image.dto";
import { AbstractDto } from "src/common/dto/abstract.dto";

export class ProductDto extends AbstractDto {
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

    @Expose()
    @Type(() => ImageDto)
    images?: ImageDto[]
    
}