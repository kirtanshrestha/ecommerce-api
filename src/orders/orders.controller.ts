import { Controller, Post, Get, Body, Param, Delete, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decoratos/roles.decorator';
import { ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }


    @UseGuards(AuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new order' }) 
    @ApiResponse({ status: 201, description: 'Product created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user.id;
        console.log(userId);
        return this.ordersService.createOrder(req.user.username, createOrderDto.products);
    }

    @Get()
    @Roles('user')
    async getAllOrder() {
        return this.ordersService.getAllOrder();
    }

    @Get(':id')
    async getOrderById(@Param('id') orderId: string) {
        return this.ordersService.getOrderById(orderId);
    }

    @Get('user/:username')
    @Roles('user')
    async getOrderByUsername(@Param('username') username: string) {
        return this.ordersService.getOrderByUserName(username);

    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string) {
        return this.ordersService.deleteOrder(id);
    }

}