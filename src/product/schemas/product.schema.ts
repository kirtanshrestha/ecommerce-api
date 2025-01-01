import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 10 })
    quantity: number;

    @Prop({ required: true })
    description: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);