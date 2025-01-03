import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from 'src/orders/orders.service';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('payment')
export class StripeController {
    constructor(private readonly stripeService: StripeService,
        private readonly ordersService: OrdersService,
    ) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create payment intent' })
    @ApiResponse({ status: 201, description: 'Payment successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post('create-intent')
    async createPaymentIntent(@Req() req) {
        const paymentIntent = await this.stripeService.createPaymentIntent(this.ordersService, req.user.username);
        return {
            url: `/public/index.html?clientSecret=${paymentIntent.client_secret}`,
        };
    }
}
