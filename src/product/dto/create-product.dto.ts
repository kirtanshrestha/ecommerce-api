
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'The name of the product',
        example: 'Pencil',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'A description of the product (optional)',
        example: 'A pencil for writing and drawing.',
    })
    @IsString()
    @IsOptional()
    description?: string;


    @ApiProperty({
        description: 'The price of the product ',
        example: 15,
    })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        description: 'The quantity of the product available in stock',
        example: 5,
    })
    @IsNumber()
    @Min(0)
    quantity: number;
}
