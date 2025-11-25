import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({
    summary: 'Add item to cart (optionally for a specific user)',
  })
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get active cart (use query param ?userId=1 for user specific)',
  })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  getCart(@Query('userId') userId?: string) {
    // Query params come as strings, convert to number if present
    const uid = userId ? parseInt(userId) : undefined;
    return this.cartService.getOrCreateCart(uid);
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  removeFromCart(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('userId') userId?: string,
  ) {
    const uid = userId ? parseInt(userId) : undefined;
    return this.cartService.removeFromCart(productId, uid);
  }
}
