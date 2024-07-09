import { Expose } from "class-transformer";

export class VariantDto {
    @Expose()
    id: number;

    @Expose()
    color: string;

    @Expose()
    size: string;

    @Expose()
    stock: number;
}