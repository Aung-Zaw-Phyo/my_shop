import { Category } from "src/categories/entities/category.entity";
import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

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
}
