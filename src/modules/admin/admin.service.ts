import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { CouponsService } from '../coupons/coupons.service';

interface AggregationResult {
  sum: string | null;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    private couponsService: CouponsService,
  ) {}

  async generateDiscountCode(userId: number) {
    return this.couponsService.generateNthOrderCoupon(userId);
  }

  async getStoreStats() {
    const totalItemsResult = (await this.orderItemRepository
      .createQueryBuilder('order_item')
      .select('SUM(order_item.quantity)', 'sum')
      .getRawOne()) as AggregationResult;

    const totalPurchaseResult = (await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.finalAmount)', 'sum')
      .getRawOne()) as AggregationResult;

    const totalDiscountResult = (await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.discountAmount)', 'sum')
      .getRawOne()) as AggregationResult;

    const coupons = await this.couponRepository.find({
      select: ['code', 'discountPercentage', 'isUsed'],
    });

    return {
      totalItemsPurchased: Number(totalItemsResult?.sum || 0),
      totalPurchaseAmount: Number(totalPurchaseResult?.sum || 0),
      totalDiscountAmount: Number(totalDiscountResult?.sum || 0),
      discountCodes: coupons,
    };
  }
}
