import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CreateCartItemDto } from './dto/requests/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/requests/update-cart_item.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @UseGuards(AuthGuard)
  addItem(@Body() createCartItemDto: CreateCartItemDto, @Request() req) {
    return this.cartItemsService.addItem(createCartItemDto, req.user);
  }

  @Patch()
  @UseGuards(AuthGuard)
  removeItem(@Body() createCartItemDto: CreateCartItemDto, @Request() req) {
    return this.cartItemsService.removeItem(createCartItemDto, req.user);
  }
}
