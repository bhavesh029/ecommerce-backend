import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { CouponsModule } from '../coupons/coupons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Coupon]),
    ConfigModule,
    CouponsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
