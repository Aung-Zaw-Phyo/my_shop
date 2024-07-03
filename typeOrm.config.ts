import { Product } from "./src/products/entities/product.entity";
import { Admin } from "./src/admins/entities/admin.entity";
import { User } from "./src/users/entities/user.entity";
import { DataSource } from "typeorm";
import { Category } from "./src/categories/entities/category.entity";
import { Variant } from "./src/variants/entities/variant.entity";

export default new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    database: "my_shop",
    username: "root",
    password: "",
    migrations: ['migrations/**'],
    entities: [User, Admin, Product, Category, Variant],
    synchronize: false,
    logging: true,
})