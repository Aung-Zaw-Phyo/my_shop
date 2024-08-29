import { CartItem } from "src/carts/entities/cart_item.entity";
import { AbstractEntity } from "src/common/database/abstract.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Variant extends AbstractEntity<Variant> {
    @Column()
    color: String;

    @Column()
    size: String;

    @Column()
    stock: number;

    @ManyToOne(() => Product, (product) => product.variants, {onDelete: "CASCADE"})
    product: Product

    @OneToMany(() => CartItem, (item) => item.variant, {cascade: true})
    items: CartItem[];
}

