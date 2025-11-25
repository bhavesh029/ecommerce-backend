import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
