import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int')
  quantity: number;
}
