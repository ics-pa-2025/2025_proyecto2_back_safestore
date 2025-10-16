import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerRepository {
    constructor(
        @InjectRepository(Customer)
        private readonly repository: Repository<Customer>
    ) {}

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const customer = this.repository.create(createCustomerDto as DeepPartial<Customer>);
        return await this.repository.save(customer);
    }

    async findAll(): Promise<Customer[]> {
        return await this.repository.find({
            relations: ['sells'],
        });
    }

    async findOne(id: number): Promise<Customer | null> {
        // use a typed any for where to avoid FindOptionsWhere typing issues
        return await this.repository.findOne({
            where: { id } as any,
            relations: ['sells'],
        });
    }

    async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
        await this.repository.update(id, updateCustomerDto as Partial<Customer>);
        return (await this.findOne(id)) as Customer;
    }

    async softDelete(id: number): Promise<void> {
        await this.repository.softDelete(id);
    }
}
