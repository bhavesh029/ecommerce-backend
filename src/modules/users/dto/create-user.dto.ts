import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 25, description: 'Age of the user' })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({
    example: 'male',
    description: 'Gender',
    enum: ['male', 'female', 'other'],
  })
  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email: string;
}
