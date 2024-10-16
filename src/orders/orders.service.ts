import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order_item.entity';
import { UsersService } from 'src/users/users.service';
import { CartsService } from 'src/carts/carts.service';
import { CartItem } from 'src/carts/entities/cart_item.entity';
import { throwValidationError } from 'src/common/helper';
import { User } from 'src/users/entities/user.entity';
import { paginate, PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';
import { paginate_items_limit, paginate_max_limit } from 'src/common/constants';
import { ShippingAddressType } from './types/shipping_address.type';
import { OrderStatusEnum } from './enums/order_status.enum';

@Injectable()
export class OrdersService {  
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private readonly cartsService: CartsService,
    private readonly usersService: UsersService,
  ) {}

  async getUserOrders(user: User, query: PaginateQuery): Promise<Paginated<Order>> {
    const config: PaginateConfig<Order> = {
      relations: [],
      sortableColumns: ['id', 'orderNumber'],
      maxLimit: paginate_max_limit,
      defaultLimit: paginate_items_limit,
      defaultSortBy: [['createdAt', 'DESC']],
      where: {user: {id: user.id}}
    }
    query.limit = query.limit == 0 ? paginate_max_limit : query.limit;
    const result = await paginate<Order>(query, this.orderRepo, config)
    return result;
  }

  async getUserOrderDetails(user: User, id: number) {
    const order = await this.orderRepo.findOne({
      where: {id: id, user: {id: user.id}}, 
      relations: ['items'], 
    }); 
    if(!order) {
      throwValidationError('Order not found.');
    }
    return order; 
  }

  async checkOrder(sessionId: string) {
    const order = await this.orderRepo.findOne({where: {stripeSessionId: sessionId}});
    if(!order) {
      throwValidationError("Order not found")
    }
    return order.id;
  }

  async createOrder(data: {userId: number, stripeSessionId: string, shippingAddress: ShippingAddressType, billingAddress: object|null}) {
    const user = await this.usersService.findOne(data.userId);
    const cart = await this.cartsService.getCart(user);
    const orderNumber = await this.getOrderNumber(user.name);

    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.amount;
    });
    const orderInstance = this.orderRepo.create({
      orderNumber: orderNumber,
      totalAmount: totalAmount,
      stripeSessionId: data.stripeSessionId,
      shippingAddress: JSON.stringify(data.shippingAddress),
      billingAddress: data.billingAddress ? JSON.stringify(data.billingAddress): null,
      user: user,
      items: [],
    });
    const order = await this.orderRepo.save(orderInstance)
    await this.saveOrderItems(cart.items, order);
  }

  async saveOrderItems(items: CartItem[], order: Order) {
    await Promise.all(
      items.map(async (item) => {
        const archiveData = JSON.stringify(item)
        const newOrderItemInstance = this.orderItemRepo.create({
          archive: archiveData,
          quantity: item.quantity, 
          amount: item.amount, 
          variant: item.variant,
          order: order,
        });
        await this.orderItemRepo.save(newOrderItemInstance);
      }),
    )
  }


  async getOrderNumber(userName: string) {
    const name = userName.replaceAll(" ", "");
    const identityCharacters = name.substring(0, 3);
    const orderNumber =  identityCharacters.toUpperCase() + Math.floor(Math.random() * 900000 + 100000);

    const order = await this.orderRepo.findOne({where: {orderNumber: orderNumber}});
    if(order) {
      return this.getOrderNumber(userName)
    }
    return orderNumber;
  }

  // Admin
  async getOrders(query: PaginateQuery): Promise<Paginated<Order>> {
    const config: PaginateConfig<Order> = {
      relations: ['user'],
      sortableColumns: ['id', 'orderNumber'],
      maxLimit: paginate_max_limit,
      defaultLimit: paginate_items_limit,
      defaultSortBy: [['createdAt', 'DESC']],
    }
    query.limit = query.limit == 0 ? paginate_max_limit : query.limit;
    const result = await paginate<Order>(query, this.orderRepo, config)
    return result;
  }

  async getOrderDetails(id: number) {
    const order = await this.orderRepo.findOne({
      where: {id: id}, 
      relations: ['user', 'items'], 
    }); 
    if(!order) {
      throwValidationError('Order not found.');
    }
    return order; 
  }

  async toggleOrderStatus(id: number) {
    const order = await this.orderRepo.findOne({where: {id: id}}); 
    if(!order) {
      throwValidationError('Order not found.');
    }
    if(order.status === OrderStatusEnum.pending) {
      order.status = OrderStatusEnum.complete
    }else {
      order.status = OrderStatusEnum.pending
    }
    const result = await this.orderRepo.save(order);
    return result;
  }

}