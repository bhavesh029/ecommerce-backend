import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CheckEligibilityDto {
  @ApiProperty({ example: 1, description: 'User ID to check eligibility for' })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
