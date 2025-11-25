import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service'; // Import UsersService
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productsService: ProductsService,
    private usersService: UsersService, // Inject UsersService
  ) {}

  // UPDATED: Logic to find cart by User ID
  async getOrCreateCart(userId?: number): Promise<Cart> {
    const query: FindOptionsWhere<Cart> = { status: 'active' };

    // If userId provided, look for that user's active cart
    if (userId) {
      query.user = { id: userId };
    } else {
      throw new BadRequestException('User ID is required to get cart');
    }

    let cart = await this.cartRepository.findOne({
      where: query,
      relations: ['cartItems', 'cartItems.product', 'user'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ status: 'active' });

      // Link User if provided
      if (userId) {
        const user = await this.usersService.findOne(userId); // Ensure user exists
        cart.user = user;
      }

      await this.cartRepository.save(cart);
      cart.cartItems = [];
    }
    return cart;
  }

  async addToCart(addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity, userId } = addToCartDto;

    const product = await this.productsService.findOne(productId);

    if (quantity > product.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Only ${product.quantity} left.`,
      );
    }

    // Pass userId to get specific cart
    const cart = await this.getOrCreateCart(userId);

    let cartItem = cart.cartItems.find((item) => item.product.id === productId);

    if (cartItem) {
      const newTotal = cartItem.quantity + quantity;
      if (newTotal > product.quantity) {
        throw new BadRequestException(`Cannot add more. Stock limit reached.`);
      }
      cartItem.quantity = newTotal;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
    }

    await this.cartItemRepository.save(cartItem);
    return this.getOrCreateCart(userId);
  }

  async removeFromCart(productId: number, userId?: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = cart.cartItems.find(
      (item) => item.product.id === productId,
    );
    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getOrCreateCart(userId);
  }
}
