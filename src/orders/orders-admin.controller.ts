import { Controller, Get, Param, UseGuards, Request, Put, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { OrderDto } from './dto/responses/order.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Order } from './entities/order.entity';
import { OrderDetailsDto } from './dto/responses/order_details.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('admin/orders')
export class OrdersAdminController {
  constructor(private readonly ordersService: OrdersService) {}
  
  @Get()
  @Serialize(OrderDto)
  @UseGuards(AdminGuard)
  getOrders(@Paginate() query: PaginateQuery): Promise<Paginated<Order>> {
    return this.ordersService.getOrders(query);
  }

  @Get(":id")
  @Serialize(OrderDetailsDto)
  @UseGuards(AdminGuard)
  getOrderDetails(@Param('id') id: string) {
    return this.ordersService.getOrderDetails(+id);
  }

  @Put(':id')
  @Serialize(OrderDto, 'Changed order status successfully.')
  @UseGuards(AdminGuard)
  updateOrder(@Param('id') id: string) {
    return this.ordersService.toggleOrderStatus(+id);
  }
}
