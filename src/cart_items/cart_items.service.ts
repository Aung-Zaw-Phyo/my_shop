import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/requests/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/requests/update-cart_item.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart_item.entity';
import { Repository } from 'typeorm';
import { CartsService } from 'src/carts/carts.service';
import { VariantsService } from 'src/variants/variants.service';

@Injectable()
export class CartItemsService { 
  constructor(
    @InjectRepository(CartItem) private readonly repo: Repository<CartItem>,
    private readonly cartsService: CartsService,
    private readonly variantsService: VariantsService,
  ) {}


  async addItem(createCartItemDto: CreateCartItemDto, user: User) {
    const cart = await this.cartsService.getCart(user);
    const variant = await this.variantsService.findOne(createCartItemDto.variantId);
    await this.variantsService.reduceStock(variant, createCartItemDto.quantity);

    const item = await this.repo.findOne({where: {cart: cart, variant: variant}})
    if(!item) {
      const newItemInstance = this.repo.create({
        cart: cart,
        variant: variant,
        quantity: createCartItemDto.quantity,
      });
      const newItem = await this.repo.save(newItemInstance);
      return newItem;
    }
    item.quantity += createCartItemDto.quantity;
    this.repo.save(item);
    
    return item;
  }

  async removeItem(createCartItemDto: CreateCartItemDto, user: User) {
    const cart = await this.cartsService.getCart(user);
    const variant = await this.variantsService.findOne(createCartItemDto.variantId);
    await this.variantsService.addStock(variant, createCartItemDto.quantity);

    const item = await this.repo.findOne({where: {cart: cart, variant: variant}})
    if(!item) {
      throw new HttpException(
        { message: ['Item not found.'], error: 'Not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    if(item.quantity == 1) {
      this.repo.remove(item);
      return null;
    }
    item.quantity -= createCartItemDto.quantity;
    this.repo.save(item);
    return item;
  }
}
