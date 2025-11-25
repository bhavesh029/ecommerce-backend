import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { CouponsService } from '../coupons/coupons.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private cartService: CartService,
    private productsService: ProductsService,
    private usersService: UsersService,
    // Circular dependency: Use forwardRef
    @Inject(forwardRef(() => CouponsService))
    private couponsService: CouponsService,
    private dataSource: DataSource, // For Transactions
  ) {}

  async checkout(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, couponCode } = createOrderDto;

    // 1. Get User and Cart
    const user = await this.usersService.findOne(userId);
    const cart = await this.cartService.getOrCreateCart(userId);

    if (cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 2. Calculate Totals & Verify Stock (Again)
    let totalAmount = 0;
    for (const item of cart.cartItems) {
      const product = await this.productsService.findOne(item.product.id);
      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Product ${product.name} is out of stock.`,
        );
      }
      totalAmount += Number(product.price) * item.quantity;
    }

    // 3. Apply Coupon Logic
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await this.couponsService.findByCode(couponCode);
      discountAmount = (totalAmount * coupon.discountPercentage) / 100;

      // Mark coupon as used
      await this.couponsService.applyCoupon(couponCode);
    }

    // 4. Run Transaction (Create Order + Decrease Stock + Clear Cart)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // A. Create Order
      const order = new Order();
      order.user = user;
      order.totalAmount = totalAmount;
      order.discountAmount = discountAmount;
      order.finalAmount = totalAmount - discountAmount;
      order.couponCode = couponCode ?? '';

      // B. Create Order Items & Decrease Stock
      const orderItems: OrderItem[] = [];
      for (const item of cart.cartItems) {
        const orderItem = new OrderItem();
        orderItem.product = item.product;
        orderItem.quantity = item.quantity;
        orderItem.priceAtPurchase = item.product.price; // Freeze price
        orderItems.push(orderItem);

        // Update Stock
        await this.productsService.update(item.product.id, {
          quantity: item.product.quantity - item.quantity,
        });
      }
      order.items = orderItems;

      // C. Save Order
      const savedOrder = await queryRunner.manager.save(Order, order);

      // D. Clear Cart
      await this.cartService.removeFromCart(null as any, userId);
      await queryRunner.manager.delete('cart_item', { cart: { id: cart.id } });

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ order: { createdAt: 'DESC' } });
  }

  // Used by CouponsService to check Nth customer logic
  async countOrders(): Promise<number> {
    return this.orderRepository.count();
  }
}
