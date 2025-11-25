import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CartService } from './cart.service';
// import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
// 1. Import the Product Entity here
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    // 2. Add 'Product' to this list so TypeORM loads its metadata here
    TypeOrmModule.forFeature([Cart, CartItem, Product]),
  ],
  //   controllers: [CartController],
  //   providers: [CartService],
  //   exports: [CartService] // Export service if needed elsewhere
})
export class CartModule {}
