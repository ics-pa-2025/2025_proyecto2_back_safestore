import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsRepository {
    constructor(
        @InjectRepository(Brand)
        private readonly repository: Repository<Brand>
    ) {}

    async create(brand: Partial<Brand>): Promise<Brand> {
        const newBrand = this.repository.create(brand);
        return await this.repository.save(newBrand);
    }

    async findAll(): Promise<Brand[]> {
        return await this.repository.find({
            order: { name: 'ASC' },
        });
    }

    async findActive(): Promise<Brand[]> {
        return await this.repository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Brand | null> {
        return await this.repository.findOne({
            where: { id },
        });
    }

    async findByName(name: string): Promise<Brand | null> {
        return await this.repository.findOne({
            where: { name },
        });
    }

    async update(id: number, brand: Partial<Brand>): Promise<Brand | null> {
        await this.repository.update(id, brand);
        return await this.findOne(id);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }

    async softDelete(id: number): Promise<boolean> {
        const result = await this.repository.update(id, { isActive: false });
        return (result.affected ?? 0) > 0;
    }

    async exists(id: number): Promise<boolean> {
        const count = await this.repository.count({
            where: { id },
        });
        return count > 0;
    }

    async nameExists(name: string, excludeId?: number): Promise<boolean> {
        const where: FindOptionsWhere<Brand> = { name };

        if (excludeId) {
            const count = await this.repository
                .createQueryBuilder('brand')
                .where('brand.name = :name', { name })
                .andWhere('brand.id != :excludeId', { excludeId })
                .getCount();
            return count > 0;
        }

        const count = await this.repository.count({ where });
        return count > 0;
    }
}
