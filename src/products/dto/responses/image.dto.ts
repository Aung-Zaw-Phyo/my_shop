import { Expose } from "class-transformer";

export class ImageDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    path?: string;
}