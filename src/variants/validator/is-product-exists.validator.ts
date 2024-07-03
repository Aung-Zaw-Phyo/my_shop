import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ProductsService } from 'src/products/products.service';

@ValidatorConstraint({ async: true, name: "productId" })
@Injectable()
export class IsProductExists implements ValidatorConstraintInterface {
    constructor(
        private readonly productService: ProductsService,
    ) {}

    async validate(productId: number, args: ValidationArguments) {
        console.log('********************', this.productService); // undefined
        // const product = await this.productService.findOne(productId);
        // return !!product; // Return true if product exists, false otherwise
        return false;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Product with ID $value does not exist.';
    }
}
