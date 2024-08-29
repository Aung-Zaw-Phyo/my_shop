import { AbstractEntity } from "src/common/database/abstract.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Image extends AbstractEntity<Image> {
    @Column()
    name: String;

    @ManyToOne(() => Product, (product) => product.images, {onDelete: "CASCADE"})
    product: Product
}

