import { IsString, IsNotEmpty, IsEmail, MinLength, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Name of the user',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    readonly name: string;


    @ApiProperty({
        description: 'Unique username for the user',
        example: 'johndoe123',
    })
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({
        description: 'Password for the user (minimum 4 characters)',
        example: 'password123',
        minLength: 4,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    readonly password: string;

    @ApiProperty({
        description: 'Roles assigned to the user',
        example: ['admin', 'user'],
        isArray: true,
    })
    @IsArray()
    @IsNotEmpty()
    roles: string[];
}
