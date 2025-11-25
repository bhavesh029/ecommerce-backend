import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'User ID placing the order' })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 'LUCKY-5',
    description: 'Optional discount code',
    required: false,
  })
  @IsString()
  @IsOptional()
  couponCode?: string;
}
