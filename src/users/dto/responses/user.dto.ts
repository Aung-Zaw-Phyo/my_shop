import { Expose, Transform } from "class-transformer";
import { AbstractDto } from "src/common/dto/abstract.dto";

export class UserDto extends AbstractDto {
    @Expose()
    id: number;
    
    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose() 
    @Transform(({value}) => value ? `${process.env.APP_URL}/uploads/users/${value}`: null)
    image: string;
}