import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { Order, OrderSchema } from 'src/orders/schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from 'src/orders/orders.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [JwtModule, AuthModule, OrdersModule, MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [StripeController],
  providers: [StripeService]
})
export class StripeModule { }
