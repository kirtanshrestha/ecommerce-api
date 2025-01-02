import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req, ValidationPipe, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decoratos/roles.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
    @UseGuards(AuthGuard)
    @Post()
    @Roles('admin')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of users.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
    @UseGuards(AuthGuard)
    @Roles('admin')
    @Get()
    async getAllUser() {
        return this.userService.getAllUser();
    }

    @ApiOperation({ summary: 'Get user by username' })
    @ApiResponse({ status: 200, description: 'User details.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Get(':username')
    async getUserByUsername(@Param('username') username: string) {
        return this.userService.getUserByUsername(username);
    }

    @ApiOperation({ summary: 'Delete user by username' })
    @ApiResponse({ status: 200, description: 'User successfully deleted.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
    @UseGuards(AuthGuard)
    @Roles('admin')
    @Delete(':username')
    async deleteUser(@Param('username') username: string) {
        return this.userService.deleteUser(username);
    }
}