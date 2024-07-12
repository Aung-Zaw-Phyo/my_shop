import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private repo: Repository<Cart>
  ) {}

  async findOne(user: User) {
    const cart = await this.getCart(user);
    return cart;
  }

  async getCart(user: User) {
    let cart = await this.repo.findOne({where: {user: user}, relations: ['items']});
    if(!cart) {
      const userInstance = this.repo.create({
        user: user
      });

      cart = await this.repo.save(userInstance)
    }
    return cart;
  }


}
