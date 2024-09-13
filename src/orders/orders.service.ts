import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order_item.entity';
import { VariantsService } from 'src/variants/variants.service';
import { UsersService } from 'src/users/users.service';
import { CartsService } from 'src/carts/carts.service';
import { CartItemDto } from 'src/carts/dto/responses/cart_item.dto';
import { CartItem } from 'src/carts/entities/cart_item.entity';
import { throwValidationError } from 'src/common/helper';
import { User } from 'src/users/entities/user.entity';
import { paginate, PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';
import { paginate_items_limit, paginate_max_limit } from 'src/common/constants';
import { ShippingAddressType } from './types/shipping_address.type';
const stripe = new Stripe('sk_test_51NNY6yLUTxip4b30ekc7ak3tz9aA7czO3e78om4LUOogaD0iMjzFEh5BLTveaf3AO3gQDnefZrCEiH5p28nUOeuS00zTuOv4PY');

@Injectable()
export class OrdersService {  
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private readonly cartsService: CartsService,
    private readonly variantsService: VariantsService,
    private readonly usersService: UsersService,
  ) {}

  async getOrders(user: User, query: PaginateQuery): Promise<Paginated<Order>> {
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

  async getOrderDetails(user: User, id: number) {
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
}

// ____________________:  {
//   id: 'evt_3PuznHLUTxip4b301jE4UqCZ',
//   object: 'event',
//   api_version: '2022-11-15',
//   created: 1725381766,
//   data: {
//     object: {
//       id: 'ch_3PuznHLUTxip4b301mHy1HSa',
//       object: 'charge',
//       amount: 48000,
//       amount_captured: 48000,
//       amount_refunded: 0,
//       application: null,
//       application_fee: null,
//       application_fee_amount: null,
//       balance_transaction: null,
//       billing_details: [Object],
//       calculated_statement_descriptor: 'Stripe',
//       captured: true,
//       created: 1725381766,
//       currency: 'usd',
//       customer: 'cus_QmYvQkqrdQ7Uax',
//       description: 'Payment for aungzawphyo@gmail.com',
//       destination: null,
//       dispute: null,
//       disputed: false,
//       failure_balance_transaction: null,
//       failure_code: null,
//       failure_message: null,
//       fraud_details: {},
//       invoice: null,
//       livemode: false,
//       metadata: [Object],
//       on_behalf_of: null,
//       order: null,
//       outcome: [Object],
//       paid: true,
//       payment_intent: 'pi_3PuznHLUTxip4b301rej6cQV',
//       payment_method: 'pm_1PuzoYLUTxip4b30OOPF9wuQ',
//       payment_method_details: [Object],
//       receipt_email: null,
//       receipt_number: null,
//       receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTk5ZNnlMVVR4aXA0YjMwKIf53LYGMgaRg7VejSk6LBbQcjenckvvDfacxA3-0hAm1MfjE3_KWd3vQZK7TeDR0AOMrP19PiSOyrfS',
//       refunded: false,
//       review: null,
//       shipping: [Object],
//       source: null,
//       source_transfer: null,
//       statement_descriptor: null,
//       statement_descriptor_suffix: null,
//       status: 'succeeded',
//       transfer_data: null,
//       transfer_group: null
//     }
//   },
//   livemode: false,
//   pending_webhooks: 2,
//   request: {
//     id: 'req_rluxG2jjiyhEQw',
//     idempotency_key: 'e4fdd9b4-04b0-447f-893f-ead9e1925a60'
//   },
//   type: 'charge.succeeded'
// }

// PaymentIntent client_secret:  {
//   id: 'pi_3PuznHLUTxip4b301rej6cQV',
//   object: 'payment_intent',
//   amount: 48000,
//   amount_capturable: 0,
//   amount_details: { tip: {} },
//   amount_received: 0,
//   application: null,
//   application_fee_amount: null,
//   automatic_payment_methods: null,
//   canceled_at: null,
//   cancellation_reason: null,
//   capture_method: 'automatic_async',
//   client_secret: 'pi_3PuznHLUTxip4b301rej6cQV_secret_UL1nRN9gkLktoj83WWBG6WQKQ',
//   confirmation_method: 'automatic',
//   created: 1725381687,
//   currency: 'usd',
//   customer: 'cus_QmYvQkqrdQ7Uax',
//   description: 'Payment for aungzawphyo@gmail.com',
//   invoice: null,
//   last_payment_error: null,
//   latest_charge: null,
//   livemode: false,
//   metadata: { shipping: '{"city":"Yangon","postalCode":12333}', userId: '17' },
//   next_action: null,
//   on_behalf_of: null,
//   payment_method: null,
//   payment_method_configuration_details: null,
//   payment_method_options: {
//     card: {
//       installments: null,
//       mandate_options: null,
//       network: null,
//       request_three_d_secure: 'automatic'
//     }
//   },
//   payment_method_types: [ 'card' ],
//   processing: null,
//   receipt_email: null,
//   review: null,
//   setup_future_usage: null,
//   shipping: {
//     address: {
//       city: 'Yangon',
//       country: 'MM',
//       line1: '123 Main Street',
//       line2: 'Apt 4B',
//       postal_code: '12333',
//       state: 'Yangon Region'
//     },
//     carrier: null,
//     name: 'Juu',
//     phone: '09912345678',
//     tracking_number: null
//   },
//   source: null,
//   statement_descriptor: null,
//   statement_descriptor_suffix: null,
//   status: 'requires_payment_method',
//   transfer_data: null,
//   transfer_group: null
// }