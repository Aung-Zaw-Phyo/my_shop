import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsString, MinLength } from 'class-validator';
import { IsUnique } from 'src/common/validators/is-unique';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsString({message: "Enter your valid category name."})
    @MinLength(1)
    name: string;
}
