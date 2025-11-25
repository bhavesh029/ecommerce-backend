import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./cart.entity"; // Points to file in same folder
// CRITICAL: Ensure this path goes up two levels (../../) to find products
import { Product } from "../../products/entities//product.entity"; 

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  cart: Cart;

  // This is the line causing the error if Product is not found
  @ManyToOne(() => Product)
  product: Product;

  @Column("int")
  quantity: number;
}