import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.repository.create(createProductDto);
        return await this.repository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return await this.repository.find({
            relations: ['brand', 'line'],
            order: { name: 'ASC' },
        });
    }

    async findAllActive(): Promise<Product[]> {
        return await this.repository.find({
            where: { isActive: true },
            relations: ['brand', 'line'],
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.repository.findOne({
            where: { id },
            relations: ['brand', 'line'],
        });

        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        return product;
    }

    async findByName(name: string): Promise<Product | null> {
        return await this.repository.findOne({
            where: { name },
            relations: ['brand', 'line'],
        });
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto
    ): Promise<Product> {
        const product = await this.findOne(id);

        Object.assign(product, updateProductDto);
        return await this.repository.save(product);
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        await this.repository.remove(product);
    }

    async softDelete(id: number): Promise<Product> {
        const product = await this.findOne(id);
        product.isActive = false;
        return await this.repository.save(product);
    }

    async restore(id: number): Promise<Product> {
        const product = await this.findOne(id);
        product.isActive = true;
        return await this.repository.save(product);
    }

    async exists(id: number): Promise<boolean> {
        const count = await this.repository.count({
            where: { id },
        });
        return count > 0;
    }

    async existsByName(name: string, excludeId?: number): Promise<boolean> {
        const query = this.repository
            .createQueryBuilder('product')
            .where('product.name = :name', { name });

        if (excludeId) {
            query.andWhere('product.id != :excludeId', { excludeId });
        }

        const count = await query.getCount();
        return count > 0;
    }

    async findByBrand(brandId: number): Promise<Product[]> {
        return await this.repository.find({
            where: { brandId, isActive: true },
            relations: ['brand', 'line'],
            order: { name: 'ASC' },
        });
    }

    async findByLine(lineId: number): Promise<Product[]> {
        return await this.repository.find({
            where: { lineId, isActive: true },
            relations: ['brand', 'line'],
            order: { name: 'ASC' },
        });
    }
}
