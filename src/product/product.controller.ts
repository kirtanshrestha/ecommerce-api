import { Controller, Post, Body, Get, Param, Delete, NotFoundException, UseGuards, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @UseGuards(AuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })  // Description of the endpoint
    @ApiResponse({ status: 201, description: 'Product created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productService.createProduct(createProductDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a list of products' })  // Description of the endpoint
    @ApiResponse({ status: 200, description: 'List of products.' })
    @ApiResponse({ status: 401, description: 'Unauthorized. User must be authenticated.' })
    async getAllProducts(): Promise<Product[]> {
        return this.productService.getAllProducts();
    }

    @ApiOperation({ summary: 'Get a specific product from its id' })
    @ApiResponse({ status: 200, description: 'specifit product.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<Product> {
        try {
            return await this.productService.getProductById(id);
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a product by ID' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async deleteProduct(@Param('id') id: string): Promise<void> {
        try {
            return await this.productService.deleteProduct(id);
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    @UseGuards(AuthGuard)
    @Patch(':name')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a product by name' })
    @ApiResponse({ status: 200, description: 'Product updated successfully.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    updateProductbyName(@Param('name') name: string, @Body() body) {
        return this.productService.updateProductbyName(name, body);
    }

    @Patch('id/:id')
    @ApiOperation({ summary: 'Update a product by ID' })
    @ApiResponse({ status: 200, description: 'Product updated successfully.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    updateProduct(@Param('id') id: string, @Body() body) {
        return this.productService.updateProduct(id, body);
    }
}