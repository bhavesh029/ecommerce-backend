import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Gaming Keyboard', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 49.99, description: 'Price of the product' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: true, description: 'Is the product currently in stock?', required: false })
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;
}