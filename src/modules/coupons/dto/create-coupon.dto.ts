import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'SAVE10', description: 'Unique discount code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 10, description: 'Discount percentage (1-100)' })
  @IsInt()
  @Min(1)
  @Max(100)
  discountPercentage: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
