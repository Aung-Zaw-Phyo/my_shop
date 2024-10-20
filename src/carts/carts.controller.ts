import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CartDto } from './dto/responses/cart.dto';
import { CreateCartItemDto } from './dto/requests/create-cart_item.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}
  @Get()
  @UseGuards(AuthGuard)
  @Serialize(CartDto, "Fetched cart successfully.")
  findOne(@Request() req) {
    return this.cartsService.findOne(req.user);
  }

  @Post('/add-item')
  @UseGuards(AuthGuard)
  @Serialize(CartDto, "Added item to cart successfully.")
  addItem(@Body() createCartItemDto: CreateCartItemDto, @Request() req) {
    return this.cartsService.addItemToCart(createCartItemDto, req.user);
  }

  @Post('/remove-item')
  @UseGuards(AuthGuard)
  @Serialize(CartDto, "Removed item from cart successfully.")
  removeItem(@Body() createCartItemDto: CreateCartItemDto, @Request() req) {
    return this.cartsService.removeItemFromCart(createCartItemDto, req.user);
  }
}
