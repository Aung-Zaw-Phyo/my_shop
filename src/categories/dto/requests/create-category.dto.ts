import { IsString, MinLength } from "class-validator";
import { IsUnique } from "src/common/validators/is-unique";

export class CreateCategoryDto {
    @IsString({message: "Enter your valid category name."})
    @IsUnique({tableName: 'category', column: 'name'})
    @MinLength(1)
    name: string;
}
