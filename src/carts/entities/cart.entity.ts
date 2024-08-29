import { AbstractEntity } from "src/common/database/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CartItem } from "./cart_item.entity";

@Entity()
export class Cart extends AbstractEntity<Cart> {
    @OneToOne(() => User, (user) => user.cart, {onDelete: 'CASCADE'})
    @JoinColumn()   
    user: User

    @OneToMany(() => CartItem, (item) => item.cart, {cascade: true})
    items: CartItem[];
}
