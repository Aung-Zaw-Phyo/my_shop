import { Controller, Post, Req, Res, Request, UseGuards, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ShippingAddressDto } from './dto/requests/shipping_address.dto';


@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  //stripe listen --forward-to localhost:5000/stripe/webhooks
  //https://docs.stripe.com/webhooks
  //https://docs.stripe.com/api/webhook_endpoints/create?lang=node
  @Post('webhooks')
  webhook(@Req() req: Request, @Res() res: Response) {
    const rawBody = req.body;
    return this.stripeService.handleWebhookEvent(rawBody);
  } 

  @Post('create-payment-intents')
  @UseGuards(AuthGuard)
  @Serialize(String)
  createPaymentIntent(@Request() req, @Body() shippingAddressDto: ShippingAddressDto) {
    return this.stripeService.createPaymentIntent(req.user, shippingAddressDto);
  }
}