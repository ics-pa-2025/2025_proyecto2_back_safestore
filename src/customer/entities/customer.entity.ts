import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Sell } from '../../sell/entities/sell.entity';


@Entity('customer')
export class Customer {
    @PrimaryGeneratedColumn()
    private id: number;
    @Column()
    private name: string;
    @Column()
    private lastName: string;
    @Column()
    private email: string;
    @Column()
    private phone: string;
    @Column()
    private address: string;
    @Column({ type: 'int', nullable: true })
    private documento: number | null;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;

    @OneToMany(() => Sell, (sell) => sell.customer)
    sells: Sell[];

    constructor(id: number, name: string, lastName: string, email: string, phone: string, address: string) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

}
