import { AbstractEntity } from "src/common/database/abstract.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin extends AbstractEntity<Admin> {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column({nullable: true})
    image: string;

    @Column()
    password: string;
}