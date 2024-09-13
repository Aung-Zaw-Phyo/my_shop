import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart_item.entity';
import { CreateCartItemDto } from './dto/requests/create-cart_item.dto';
import { VariantsService } from 'src/variants/variants.service';
import { throwValidationError } from 'src/common/helper';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    private readonly variantsService: VariantsService,
  ) {}

  async findOne(user: User) {
    const cart = await this.getCart(user);
    return cart;
  }

  async getCart(user: User) {
    let cart = await this.cartRepo.findOne({where: {user: {id: user.id}}, relations: ['items.variant.product.images', 'user']});
    if(!cart) {
      const userInstance = this.cartRepo.create({
        user: user,
        items: [],
      });

      cart = await this.cartRepo.save(userInstance)
    }
    return cart;
  }

  async addItemToCart(createCartItemDto: CreateCartItemDto, user: User) {
    const cart = await this.getCart(user);
    const variant = await this.variantsService.findOne(createCartItemDto.variantId);
    await this.variantsService.reduceStock(variant, createCartItemDto.quantity);

    const item = await this.cartItemRepo.findOne({where: {cart: {id: cart.id}, variant: {id: variant.id}}})
    if(!item) {
      const newItemInstance = this.cartItemRepo.create({
        cart: cart,
        variant: variant,
        quantity: createCartItemDto.quantity,
        amount: createCartItemDto.quantity * variant.product.price,
      });
      await this.cartItemRepo.save(newItemInstance);
    } else {
      item.quantity += createCartItemDto.quantity;
      item.amount += createCartItemDto.quantity * variant.product.price;
      await this.cartItemRepo.save(item);
    }
    return this.getCart(user);
  }

  async removeItemFromCart(createCartItemDto: CreateCartItemDto, user: User) {
    const cart = await this.getCart(user);
    const variant = await this.variantsService.findOne(createCartItemDto.variantId);
    
    const item = await this.cartItemRepo.findOne({where: {cart: {id: cart.id}, variant: {id: variant.id}}})
    if(!item) {
      throwValidationError('Item not found.');
    }
    await this.variantsService.addStock(variant, createCartItemDto.quantity);
    if(item.quantity === 1) {
      await this.cartItemRepo.remove(item);
    }else {
      item.quantity -= createCartItemDto.quantity;
      item.amount -= createCartItemDto.quantity * variant.product.price;
      await this.cartItemRepo.save(item);
    }
    return this.getCart(user);
  }
}
