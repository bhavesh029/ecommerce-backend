import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { Coupon } from './entities/coupon.entity';
import { OrdersModule } from '../orders/orders.module'; // Import OrdersModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon]),
    ConfigModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
