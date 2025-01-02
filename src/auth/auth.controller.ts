import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login to the system and get an authentication token' })
    @ApiResponse({ status: 200, description: 'Successfully logged in and received a token.' })
    @ApiResponse({ status: 400, description: 'Invalid credentials or other error.' })
    @ApiBody({
        description: 'User credentials (username and password)',
        schema: {
            properties: {
                username: { type: 'string', example: 'admin2' },
                password: { type: 'string', example: 'adminpass2' },
            },
        },
    })
    async login(@Req() req, @Body() body: { username: string, password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (user.flag == 0)
            return { message: `No ${body.username} found` };

        if (user.flag == 2)
            return { message: `Password for ${body.username} invalid` };

        const token = this.authService.generateToken(body.username, user.roles);
        return { token };
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Access protected route with authentication' })
    @ApiResponse({ status: 200, description: 'Successfully accessed protected route.' })
    @ApiResponse({ status: 401, description: 'Unauthorized, invalid or expired token.' })
    getProtected(@Req() req) {

        return { message: 'protected route', user: req.user };
    }
}