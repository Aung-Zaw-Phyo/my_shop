import { Category } from "src/categories/entities/category.entity";
import { AbstractEntity } from "src/common/database/abstract.entity";
import { Variant } from "src/variants/entities/variant.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Image } from "./image.entity";
import { config } from "process";

@Entity()
export class Product extends AbstractEntity<Product> {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @ManyToMany(() => Category, category => category.products, { cascade: true, onDelete: 'CASCADE'})
    @JoinTable()
    categories: Category[];

    @OneToMany(() => Variant, (variant) => variant.product, {cascade: true})
    variants: Variant[];

    @OneToMany(() => Image, (image) => image.product, {cascade: true})
    images: Image[];
}

