import { IsArray, IsString, IsNotEmpty, IsNumber, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductDto {
    @ApiProperty({
        description: 'Name of the product',
        example: 'Laptop',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Quantity of the product',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

}

export class CreateOrderDto {
    username: string;

    @ApiProperty({
        description: 'List of products in the order',
        type: [ProductDto],
    })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];
}
