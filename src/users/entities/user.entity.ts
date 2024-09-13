import { Cart } from "src/carts/entities/cart.entity";
import { AbstractEntity } from "src/common/database/abstract.entity";
import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends AbstractEntity<User> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({nullable: true})
    image: string;

    @Column()
    password: string;

    @OneToOne(() => Cart, (cart) => cart.user, { cascade: true, onDelete: 'CASCADE' })
    cart: Cart;

    @OneToMany(() => Order, (order) => order.user, { cascade: true, onDelete: 'CASCADE' })
    orders: Order[];
}