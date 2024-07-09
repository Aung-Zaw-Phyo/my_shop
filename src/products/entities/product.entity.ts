import { Category } from "src/categories/entities/category.entity";
import { AbstractEntity } from "src/common/database/abstract.entity";
import { Variant } from "src/variants/entities/variant.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class Product extends AbstractEntity<Product> {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @ManyToMany(() => Category, category => category.products)
    @JoinTable()
    categories: Category[];

    @OneToMany(() => Variant, (variant) => variant.product, {cascade: true})
    variants: Variant[];
}

