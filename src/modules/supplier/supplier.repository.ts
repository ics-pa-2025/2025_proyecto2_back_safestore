import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierRepository {
    constructor(
        @InjectRepository(Supplier)
        private readonly repository: Repository<Supplier>
    ) {}

    async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
        const supplier = this.repository.create(createSupplierDto);
        return await this.repository.save(supplier);
    }

    async findAll(): Promise<Supplier[]> {
        return await this.repository.find({
            order: { name: 'ASC' },
        });
    }

    async findAllActive(): Promise<Supplier[]> {
        return await this.repository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Supplier> {
        const supplier = await this.repository.findOne({
            where: { id },
        });

        if (!supplier) {
            throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
        }

        return supplier;
    }

    async findByName(name: string): Promise<Supplier | null> {
        return await this.repository.findOne({
            where: { name },
        });
    }

    async update(
        id: number,
        updateSupplierDto: UpdateSupplierDto
    ): Promise<Supplier> {
        const supplier = await this.findOne(id);

        Object.assign(supplier, updateSupplierDto);
        return await this.repository.save(supplier);
    }

    async remove(id: number): Promise<void> {
        const supplier = await this.findOne(id);
        await this.repository.remove(supplier);
    }

    async softDelete(id: number): Promise<Supplier> {
        const supplier = await this.findOne(id);
        supplier.isActive = false;
        return await this.repository.save(supplier);
    }

    async restore(id: number): Promise<Supplier> {
        const supplier = await this.findOne(id);
        supplier.isActive = true;
        return await this.repository.save(supplier);
    }

    async exists(id: number): Promise<boolean> {
        const count = await this.repository.count({
            where: { id },
        });
        return count > 0;
    }

    async existsByName(name: string, excludeId?: number): Promise<boolean> {
        const query = this.repository
            .createQueryBuilder('supplier')
            .where('supplier.name = :name', { name });

        if (excludeId) {
            query.andWhere('supplier.id != :excludeId', { excludeId });
        }

        const count = await query.getCount();
        return count > 0;
    }
}
