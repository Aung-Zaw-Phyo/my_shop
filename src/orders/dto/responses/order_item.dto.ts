import { Expose, plainToInstance, Transform } from "class-transformer";
import { OrderItem } from "src/orders/entities/order_item.entity";
import { ImageDto } from "src/products/dto/responses/image.dto";

export class OrderItemDto {
    @Expose()
    id: number;

    @Expose() 
    @Transform((value) => {
        const archiveData = JSON.parse(value['obj']['archive']);
        return archiveData['quantity'];
    })
    quantity: number;

    @Expose() 
    @Transform((value) => {
        const archiveData = JSON.parse(value['obj']['archive']);
        return archiveData['variant']['color'];
    })
    color: string;

    @Expose() 
    @Transform((value) => {
        const archiveData = JSON.parse(value['obj']['archive']);
        return archiveData['variant']['size'];
    })
    size: string;

    @Expose() 
    @Transform((value) => {
        const archiveData = JSON.parse(value['obj']['archive']);
        return archiveData['variant']['product']['name'];
    })
    name: string;

    @Expose() 
    @Transform((value) => {
        const archiveData = JSON.parse(value['obj']['archive']);
        return archiveData['variant']['product']['description'];
    })
    description: string;

    @Expose() 
    @Transform((value) => {
        const archiveData = JSON.parse(value['obj']['archive']);
        return archiveData['variant']['product']['price'];
    })
    price: number;

    @Expose() 
    @Transform((value) => {
        const archiveData = JSON.parse(value['obj']['archive']);
        return plainToInstance(ImageDto, archiveData['variant']['product']['images']);
    })
    images: ImageDto[];
}