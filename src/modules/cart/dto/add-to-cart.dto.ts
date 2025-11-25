import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 1, description: 'The Product ID' })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 1, description: 'Quantity to add' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 1,
    description: 'User ID (Optional for guest)',
    required: false,
  })
  @IsInt()
  @IsOptional()
  userId?: number;
}
