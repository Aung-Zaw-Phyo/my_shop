import { Injectable } from '@nestjs/common';
import { CartsService } from 'src/carts/carts.service';
import { OrdersService } from 'src/orders/orders.service';
import { User } from 'src/users/entities/user.entity';
import Stripe from 'stripe';
import { ShippingAddressDto } from './dto/requests/shipping_address.dto';
const stripe = new Stripe(process.env.STRIPE_API_KEY);

@Injectable()
export class StripeService {
    constructor(
        private readonly cartsService: CartsService,
        private readonly ordersService: OrdersService,
      ) {}

    async createPaymentIntent(user: User, shippingAddressDto: ShippingAddressDto) {
        const cart = await this.cartsService.getCart(user);
        const customer = await stripe.customers.create()
        
        const paymentIntent = await stripe.paymentIntents.create({
            customer: customer['id'],
            shipping: {
                name: shippingAddressDto.name,
                address: {
                  line1: shippingAddressDto.line1,
                  line2: shippingAddressDto.line2,
                  city: shippingAddressDto.city,
                  state: shippingAddressDto.state,
                  postal_code: shippingAddressDto.postal_code,
                  country: shippingAddressDto.country,
                },
                phone: shippingAddressDto.phone,
            },
            amount: cart.items.reduce((total, item) => total + item.variant.product.price * item.quantity * 100, 0),
            currency: 'usd',
            payment_method_types: ['card'],
            description: `Payment for ${user.email}`,
            metadata: {
              userId: user.id.toString(),
            },
          });
          return paymentIntent['client_secret'];
    }

    async handleWebhookEvent(data: object) {
      if(data['type'] == 'charge.succeeded') {
        const userId = parseInt(data['data']['object']['metadata']['userId']);
        const shippingData = data['data']['object']['shipping'];
        const formattedShippingData = {
          name: shippingData['name'],
          phone: shippingData['phone'],
          line1: shippingData['address']['line1'],
          line2: shippingData['address']['line2'],
          city: shippingData['address']['city'],
          state: shippingData['address']['state'],
          postal_code: shippingData['address']['postal_code'],
          country: shippingData['address']['country'],
        }

        this.ordersService.createOrder({
          userId: userId, 
          stripeSessionId: data['data']['object']['payment_intent'], 
          shippingAddress: formattedShippingData, 
          billingAddress: null,
        });
      }
    }
} 