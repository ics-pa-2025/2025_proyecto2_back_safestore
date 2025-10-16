import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { Line } from '../../line/entities/line.entity';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { SellDetail } from '../../sell-detail/entities/sell-detail.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int' })
    stock: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relación de muchos a uno con la tabla brand
    @ManyToOne(() => Brand, { nullable: false })
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @Column({ name: 'brand_id' })
    brandId: number;

    @ManyToMany(() => Supplier, (supplier) => supplier.products)
    @JoinTable({
        name: 'product_suppliers',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'supplier_id',
            referencedColumnName: 'id',
        },
    })
    suppliers: Supplier[];

    // Relación de muchos a uno con la tabla line
    @ManyToOne(() => Line, { nullable: false })
    @JoinColumn({ name: 'line_id' })
    line: Line;

    @Column({ name: 'line_id' })
    lineId: number;

    @OneToMany(() => SellDetail, (sellDetail) => sellDetail.product)
    sellDetails: SellDetail[];
}
