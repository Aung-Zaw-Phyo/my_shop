import { Admin } from "./src/admin/admin.entity";
import { User } from "./src/user/user.entity";
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