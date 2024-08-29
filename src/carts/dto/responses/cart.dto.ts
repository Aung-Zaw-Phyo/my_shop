import { Expose, Type } from "class-transformer";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { UserDto } from "src/users/dto/responses/user.dto";
import { CartItemDto } from "./cart_item.dto";

export class CartDto extends AbstractDto {
    @Expose()
    id: number;

    @Expose()
    @Type(() => UserDto)
    user?: UserDto; 

    @Expose()
    @Type(() => CartItemDto)
    items: CartItemDto[]; 
}