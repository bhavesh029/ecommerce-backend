import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "../../products/entities/products.entity";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Cart, cart => cart.cartItems, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    quantity: number;

}