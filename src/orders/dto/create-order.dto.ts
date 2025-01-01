import { IsArray, IsString, IsNotEmpty, IsNumber, ArrayNotEmpty, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    price: number;
}

export class CreateOrderDto {

    username: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];
}
