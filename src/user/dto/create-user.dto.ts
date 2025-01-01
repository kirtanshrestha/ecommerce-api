import { IsString, IsNotEmpty, IsEmail, MinLength, IsArray } from 'class-validator';
import { Document } from 'mongoose';
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    readonly password: string;

    @IsArray()
    @IsNotEmpty()
    roles :string[];
    

}
