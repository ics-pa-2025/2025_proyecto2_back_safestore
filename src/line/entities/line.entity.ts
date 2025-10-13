import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
