import { Controller, Post, Body, Get, Param, Delete, NotFoundException, UseGuards, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decoratos/roles.decorator';
import { create } from 'domain';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Post()
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })  // Description of the endpoint
    @ApiResponse({ status: 201, description: 'Product created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
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

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific product from its id' })
    @ApiResponse({ status: 200, description: 'specific product.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async getProductById(@Param('id') id: string): Promise<Product> {
        try {
            return await this.productService.getProductById(id);
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
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


    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':name')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a product by name' })
    @ApiResponse({ status: 200, description: 'Product updated successfully.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateProductbyName(@Param('name') name: string, @Body() createProductDto:CreateProductDto) {
        return this.productService.updateProductbyName(name, createProductDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Patch('id/:id')
    @ApiOperation({ summary: 'Update a product by ID' })
    @ApiResponse({ status: 200, description: 'Product updated successfully.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
    updateProduct(@Param('id') id: string, @Body() createProductDto: CreateProductDto) {
        return this.productService.updateProduct(id, createProductDto);
    }
}