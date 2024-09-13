import { AbstractEntity } from "src/common/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { Variant } from "src/variants/entities/variant.entity";

@Entity()
export class OrderItem extends AbstractEntity<OrderItem> {
    @Column('longtext', { nullable: false })
    archive: string;

    @Column()
    quantity: number;

    @Column()
    amount: number;

    @ManyToOne(() => Variant, (variant) => variant.orderItems)
    variant: Variant;

    @ManyToOne(() => Order, (order) => order.items, {onDelete: "CASCADE"})
    order: Order;
}