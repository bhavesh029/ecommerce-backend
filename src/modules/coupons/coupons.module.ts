import { Module } from "@nestjs/common";
import { Coupon } from "./entities/coupon.entity";

@Module({
    imports: [Coupon],
    controllers: [],
    providers: [],
    exports: []
})
export class CouponsModule {}