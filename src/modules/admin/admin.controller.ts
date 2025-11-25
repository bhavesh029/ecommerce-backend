import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiSecurity,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { CheckEligibilityDto } from '../coupons/dto/check-eligibility.dto'; // Reuse DTO

@ApiTags('Admin')
@ApiHeader({
  name: 'x-admin-api-key',
  description: 'Admin API Key required for access',
})
@ApiSecurity('api_key')
@UseGuards(ApiKeyGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('generate-coupon')
  @ApiOperation({
    summary: 'Manually check and generate Nth coupon for a user',
  })
  @ApiResponse({ status: 200, description: 'Returns eligibility' })
  generateCoupon(@Body() dto: CheckEligibilityDto) {
    // Expect User ID in body
    return this.adminService.generateDiscountCode(dto.userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get store analytics' })
  getStats() {
    return this.adminService.getStoreStats();
  }
}
