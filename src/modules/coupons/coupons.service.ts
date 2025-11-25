import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { OrdersService } from '../orders/orders.service'; // Import OrdersService

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
    private configService: ConfigService,
    // Inject OrdersService to get real count
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const existing = await this.couponsRepository.findOneBy({
      code: createCouponDto.code,
    });
    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }
    const coupon = this.couponsRepository.create(createCouponDto);
    return await this.couponsRepository.save(coupon);
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponsRepository.findOneBy({ code });
    if (!coupon) {
      throw new NotFoundException(`Coupon ${code} not found`);
    }
    if (!coupon.isActive || coupon.isUsed) {
      throw new BadRequestException('Coupon is invalid or expired');
    }
    return coupon;
  }

  async generateNthOrderCoupon(): Promise<{
    eligible: boolean;
    coupon?: Coupon;
  }> {
    const n = this.configService.get<number>('DISCOUNT_NTH_INTERVAL') || 5;

    // 1. Get REAL order count from Order Module
    const currentOrderCount = await this.ordersService.countOrders();
    const nextOrderIndex = currentOrderCount + 1;

    if (nextOrderIndex % n === 0) {
      const code = `LUCKY-${nextOrderIndex}`;
      let coupon = await this.couponsRepository.findOneBy({ code });

      if (!coupon) {
        coupon = this.couponsRepository.create({
          code,
          discountPercentage: 50,
          isActive: true,
          isUsed: false,
        });
        await this.couponsRepository.save(coupon);
      }
      return { eligible: true, coupon };
    }

    return { eligible: false };
  }

  async applyCoupon(code: string): Promise<void> {
    const coupon = await this.findByCode(code);
    coupon.isUsed = true;
    coupon.isActive = false;
    await this.couponsRepository.save(coupon);
  }
}
