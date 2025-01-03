import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stripe } from 'stripe';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/orders/schemas/order.schema';;
import { OrdersService } from 'src/orders/orders.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private readonly orderService: OrdersService) {
        this.stripe = new Stripe('sk_test_51QckCVB25KygpkP3r9640OfL3qObYuAlAxUfmrlCrwZCpNqeE2ueXre3PYk9e6WPeUyMPoTldO31k2gSxBIWcc9n00OZ6VlPmt', {
            apiVersion: '2024-12-18.acacia',
        });

    }

    async createPaymentIntent(ordersService: OrdersService, username: string) {

        const orders = await ordersService.getOrderByUserName(username);

        var amount = 0;
        for (const order of orders as OrderDocument[]) {
            const orderId = order._id.toString();
            if (order.status != 'Paid') {
                amount += order.total;
                await this.orderModel.updateOne(
                    { _id: orderId },
                    { $set: { status: 'Paid' } }
                );
            }
        }

        if (amount != 0) {
            try {
                amount = amount * 100;
                const paymentIntent = await this.stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'usd',
                });
                return paymentIntent;
            } catch (error) {
                throw new Error('Payment Intent creation failed');
            }
        }
        else
            throw new NotFoundException(`${username} doesnt have any product to pay for.`)
    }
}
