import { Cart } from "src/carts/entities/cart.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
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

    @OneToOne(() => Cart, (cart) => cart.user, {cascade: true})
    cart: Cart
}