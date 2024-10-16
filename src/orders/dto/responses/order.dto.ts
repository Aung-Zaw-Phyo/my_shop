import { Expose, Transform, Type } from "class-transformer";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { OrderStatusEnum } from "src/orders/enums/order_status.enum";
import { ShippingAddressType } from "src/orders/types/shipping_address.type";
import { UserDto } from "src/users/dto/responses/user.dto";

export class OrderDto extends AbstractDto {
    @Expose()
    id: number;

    @Expose()
    orderNumber: string;

    @Expose()
    totalAmount: number;

    @Expose()
    status: OrderStatusEnum;

    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @Expose()
    @Transform(({value}) => {
        return JSON.parse(value);
    })
    shippingAddress: ShippingAddressType;
}