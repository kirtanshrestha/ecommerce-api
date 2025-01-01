import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req, ValidationPipe, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard)
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    async getAllUser() {
        return this.userService.getAllUser();
    }

    @Get(':username')
    async getUserByUsername(@Param('username') username: string) {
        return this.userService.getUserByUsername(username);
    }

    @Delete(':username')
    async deleteUser(@Param('username') username: string) {
        return this.userService.deleteUser(username);
    }
}