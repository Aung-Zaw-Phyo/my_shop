import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { VariantsService } from 'src/variants/variants.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from '../entities/variant.entity';
import { Repository } from 'typeorm';


@ValidatorConstraint({ name: 'CheckVariant', async: true })
@Injectable()
export class CheckVariantRule implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Variant) private readonly repo: Repository<Variant>) {}

  async validate(varaintId: number) {
    try {
      console.log('********************', varaintId, this.repo); // undefined
      const variant = await this.repo.findOne({where: {id: varaintId}});
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `User doesn't exist`;
  }
}