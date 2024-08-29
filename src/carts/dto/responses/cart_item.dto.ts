import { Expose, Type } from "class-transformer";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { VariantDto } from "src/variants/dto/responses/variant.dto";

export class CartItemDto extends AbstractDto {
    @Expose()
    id: number;

    @Expose()
    quantity: number;

    @Expose()
    @Type(() => VariantDto)
    variant: VariantDto[]; 
}