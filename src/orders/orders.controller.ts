import { Controller, Post, Get, Body, Param, Delete, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decoratos/roles.decorator';
import { ApiResponse, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }


    @UseGuards(AuthGuard,RolesGuard)
    @Post()
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Product created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires user role.' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(req.user.username, createOrderDto.products);
    }

    @Get()
    @UseGuards(AuthGuard,RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a list of orders' })
    @ApiResponse({ status: 200, description: 'List of orders.' })
    @ApiResponse({ status: 401, description: 'Unauthorized. User must be authenticated.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
    @Roles('admin')
    async getAllOrder() {
        return this.ordersService.getAllOrder();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific order from its id' })
    @ApiResponse({ status: 200, description: 'Specific order.' })
    @ApiResponse({ status: 404, description: 'Order not found.' })
    async getOrderById(@Param('id') orderId: string) {
        return this.ordersService.getOrderById(orderId);
    }

    @UseGuards(AuthGuard)
    @Get('user/:username')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a specific order from username' })
    @ApiResponse({ status: 200, description: 'specific order.' })
    @ApiResponse({ status: 404, description: 'Order not found.' })
    async getOrderByUsername(@Param('username') username: string) {
        return this.ordersService.getOrderByUserName(username);

    }

    @UseGuards(AuthGuard,RolesGuard)
    @Delete(':id')
    @ApiBearerAuth()
    @Roles('admin')
    @ApiOperation({ summary: 'Delete an order by ID' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Order not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
    async deleteOrder(@Param('id') id: string) {
        return this.ordersService.deleteOrder(id);
    }

}