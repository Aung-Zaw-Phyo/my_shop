import { Admin } from "./src/admins/entities/admin.entity";
import { User } from "./src/users/entities/user.entity";
import { DataSource } from "typeorm";

export default new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    database: "my_shop",
    username: "root",
    password: "",
    migrations: ['migrations/**'],
    entities: [User, Admin],
    synchronize: false,
    logging: true,
})