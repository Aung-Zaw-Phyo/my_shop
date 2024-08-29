import { Cart } from "src/carts/entities/cart.entity";
import { AbstractEntity } from "src/common/database/abstract.entity";
import { Variant } from "src/variants/entities/variant.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CartItem extends AbstractEntity<CartItem> {
    @Column()
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.items, {onDelete: "CASCADE"})
    cart: Cart;

    @ManyToOne(() => Variant, (variant) => variant.items, {onDelete: "CASCADE"})
    variant: Cart;
}
