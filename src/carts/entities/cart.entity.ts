import { AbstractEntity } from "src/common/database/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Cart extends AbstractEntity<Cart> {
    @OneToOne(() => User, (user) => user.cart, {onDelete: 'CASCADE'})
    @JoinColumn()   
    user: User
}
