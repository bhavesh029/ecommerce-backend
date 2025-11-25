import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn()
    id: string;
    
    @Column({unique: true})
    code: string;

    @Column()
    discountType: 'percentage' | 'fixed';

    @Column("int")
    value: number; // e.g., 10 for 10% or 500

    @Column({nullable: true})
    minCartValue: number;

    @Column()
    isActive: boolean;
}