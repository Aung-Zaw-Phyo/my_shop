import { AbstractEntity } from "src/common/database/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { OrderItem } from "./order_item.entity";
import { OrderStatusEnum } from "../enums/order_status.enum";

@Entity()
export class Order extends AbstractEntity<Order> {
    @Column({unique: true})
    orderNumber: string;

    @Column()
    totalAmount: number;

    @Column()
    stripeSessionId: string;

    @Column({type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.pending})
    status: OrderStatusEnum;

    @Column('longtext', { nullable: false })
    shippingAddress: string;

    @Column('longtext', { nullable: true })
    billingAddress: string;
    
    @ManyToOne(() => User, (user) => user.orders, {onDelete: 'CASCADE'})
    user: User

    @OneToMany(() => OrderItem, (item) => item.order, {cascade: true})
    items: OrderItem[];
}