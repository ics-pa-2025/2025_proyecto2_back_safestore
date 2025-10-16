import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SellDetail } from '../../sell-detail/entities/sell-detail.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';

@Entity('sell')
export class Sell {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'text', nullable: false })
    idVendedor: string;

    @Column({ type: 'text', nullable: true })
    idComprador: string;

    @ManyToOne(() => Customer, (customer) => customer.sells, { nullable: true })
    @JoinColumn({ name: 'id_comprador' })
    customer: Customer;

    @OneToMany(() => SellDetail, (sellDetail) => sellDetail.sell)
    sellDetails: SellDetail[];
}
