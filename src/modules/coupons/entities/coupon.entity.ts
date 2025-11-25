import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // e.g., "LUCKY-100"

  @Column('int')
  discountPercentage: number; // e.g., 10 for 10%

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isUsed: boolean; // Tracks if the Nth order coupon has been consumed
}
