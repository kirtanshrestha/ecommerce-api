import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';


@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const { name, price, description, quantity } = createProductDto;
        const newProduct = new this.productModel({ name, price, description, quantity });
        return newProduct.save();
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productModel.find().exec();
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async updateProduct(
        id: string,
        updateData: Partial<{ name: string; price: number; description: string; quantity: number }>,
    ): Promise<Product> {
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .exec();
        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }
    async updateProductbyName(
        name: string,
        updateData: Partial<{ price: number; description: string; quantity: number }>,
    ): Promise<Product> {
        const updatedProduct = await this.productModel
            .findOneAndUpdate({ name }, updateData, { new: true, runValidators: true })
            .exec();
        if (!updatedProduct) {
            throw new NotFoundException(`Product ${name} not found`);
        }
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<any> {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new NotFoundException(`Product with ID ${id} not found`);
        return { msg: `Product with ID ${id} has been deleted.` }
    }
}