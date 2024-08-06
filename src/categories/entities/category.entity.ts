
import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from '../../common/database/abstract.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Category extends AbstractEntity<Category> {
    @Column()
    @Index({ unique: true })
    name: string;

    @ManyToMany(() => Product, product => product.categories, { cascade: true, onDelete: 'CASCADE' })
    products: Product[];

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}   
