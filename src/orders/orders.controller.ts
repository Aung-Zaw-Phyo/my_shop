import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { OrderDto } from './dto/responses/order.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Order } from './entities/order.entity';
import { OrderDetailsDto } from './dto/responses/order_details.dto';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  
  @Get()
  @Serialize(OrderDto)
  getUserOrders(@Request() req, @Paginate() query: PaginateQuery): Promise<Paginated<Order>> {
    return this.ordersService.getUserOrders(req.user, query);
  }

  @Get(":id")
  @Serialize(OrderDetailsDto)
  getUserOrderDetails(@Request() req, @Param('id') id: string) {
    return this.ordersService.getUserOrderDetails(req.user, +id);
  }

  @Get('/check/:sessionId')
  @Serialize(Number)
  checkOrder(@Param('sessionId') sessionId: string) {
    return this.ordersService.checkOrder(sessionId);
  }
}
