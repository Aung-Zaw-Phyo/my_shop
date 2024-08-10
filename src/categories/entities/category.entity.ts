
import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from '../../common/database/abstract.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Category extends AbstractEntity<Category> {
    @Column()
    @Index({ unique: true })
    name: string;

    @ManyToMany(() => Product, product => product.categories)
    products: Product[];
}   
