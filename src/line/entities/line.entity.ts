import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';

@Entity('line')
export class Line {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(() => Brand, (brand) => brand.lines, { nullable: false })
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @Column({ name: 'brand_id' })
    brandId: number;
}
