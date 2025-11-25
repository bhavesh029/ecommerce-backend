import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    userId: string;

    @Column({ default: "active" }) //active, ordered, abondoned
    status: string;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true, eager: true })
    cartItems: CartItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}