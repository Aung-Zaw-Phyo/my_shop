import { Expose, Transform } from "class-transformer";
import { AbstractDto } from "src/common/dto/abstract.dto";

export class AdminDto extends AbstractDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    email: string

    @Expose()
    @Transform(({value}) => value ? `${process.env.APP_URL}/uploads/admins/${value}`: null)
    image: string
}