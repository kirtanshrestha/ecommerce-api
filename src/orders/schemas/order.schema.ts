import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {

    @Prop({})
    username: string;

    @Prop({ required: true })
    products: [];

    @Prop({})
    total: number;

    @Prop({ defaults: 'pending' })
    status: string;

}
export const OrderSchema = SchemaFactory.createForClass(Order);