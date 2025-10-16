import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return await this.repository.create(createCustomerDto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    const customer = await this.repository.findOne(id);
    if (!customer) throw new NotFoundException(`Customer with id ${id} not found`);
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.repository.findOne(id);
    if (!customer) throw new NotFoundException(`Customer with id ${id} not found`);
    return await this.repository.update(id, updateCustomerDto);
  }

  async remove(id: number) {
    const customer = await this.repository.findOne(id);
    if (!customer) throw new NotFoundException(`Customer with id ${id} not found`);
    await this.repository.softDelete(id);
    return { deleted: true };
  }
}
