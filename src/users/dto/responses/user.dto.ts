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
    @Transform((value) => {
        const image = value['obj']['image'];
        return image ? 
                `${process.env.APP_URL}/uploads/users/${image}`: 
                `https://ui-avatars.com/api/?background=222E41&color=fff&name=${value['obj']['name']}`;
    })
    image: string;
}