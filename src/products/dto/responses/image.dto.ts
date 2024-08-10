import { Expose, Transform } from "class-transformer";

export class ImageDto {
    @Expose()
    id: number;

    @Expose()
    @Transform(({value}) => `${process.env.APP_URL}/uploads/products/${value}`)
    name: string;
}