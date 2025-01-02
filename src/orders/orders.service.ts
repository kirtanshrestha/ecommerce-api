import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { ProductService } from '../product/product.service';


@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        private readonly productService: ProductService,
    ) { }

    async createOrder(username: string, products: { name: string; quantity: number; price?: number }[]) {

        const tempProduct = [];
        for (const order of products) {
            const product = await this.productModel.findOne({ name: { $regex: `^${order.name}$`, $options: 'i' } });
            if (!product || product.quantity < order.quantity) {
                console.log(`No ${order.name} in inventory`);
                continue;
            }
            order.price = product.price;

            tempProduct.push(order);
            const qty = product.quantity - order.quantity;

            this.productService.updateProduct(product.id, { quantity: qty, price: product.price });
        }
        const total = tempProduct.reduce((total, product) => total + (product.price * product.quantity), 0);
        if (total == 0)
            return { msg: `${total}Order cannot be created.` };

        const newOrder = new this.orderModel({
            username,
            products: tempProduct,
            total,
            status: 'Shipped',
        });
        return newOrder.save();

    }

    async getOrderById(id: string): Promise<Order> {
        const order = await this.orderModel.findById(id).exec();
        return order;
    }

    async getOrderByUserName(username: string): Promise<Order[]> {
        const orders = await this.orderModel.find({ username }).exec();
        if (!orders.length)
            throw new NotFoundException(`${username} doesnt have any order to display!`);
        return orders;
    }

    async getAllOrder(): Promise<Order[]> {
        return await this.orderModel.find().exec();
    }

    async updateOrderStatus(orderId: string, status: string) {
        const order = await this.orderModel.findById({ orderId });
        if (!order)
            throw new NotFoundException(`Order with ID ${orderId} not found!`);
        order.status = status;
        return order.save();
    }

    async deleteOrder(id: string) {
        const order = await this.orderModel.findByIdAndDelete({ id }).exec(); // use findoneanddelete 
        if (!order)
            throw new NotFoundException(`Order with ID ${id} not found!`);
        else
            return { msg: `Order with ID ${id} has been deleted.` };
    }

}
