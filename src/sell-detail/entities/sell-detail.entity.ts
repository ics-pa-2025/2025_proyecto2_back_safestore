import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Sell } from '../../sell/entities/sell.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('sell_detail')
export class SellDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioUnitario: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Sell, (sell) => sell.sellDetails, { nullable: false })
    @JoinColumn({ name: 'sell_id' })
    sell: Sell;

    // Relación uno a uno con Product
    @OneToOne(() => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'product_id', nullable: true })
    productId: number;
}
