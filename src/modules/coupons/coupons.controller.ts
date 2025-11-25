import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a standard coupon' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Validate and get coupon details' })
  findByCode(@Param('code') code: string) {
    return this.couponsService.findByCode(code);
  }

  @Post('request-nth')
  @ApiOperation({
    summary:
      'Request a discount code (Checks Nth customer logic against real orders)',
  })
  @ApiResponse({ status: 200, description: 'Check result' })
  requestNthCoupon() {
    return this.couponsService.generateNthOrderCoupon();
  }
}
