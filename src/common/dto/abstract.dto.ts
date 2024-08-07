import { Expose } from "class-transformer";

export class AbstractDto {
    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}