import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Supplier } from '../supplier/entities/supplier.entity';

@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>,
        @InjectRepository(Supplier)
        private readonly supplierRepository: Repository<Supplier>
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        // Separar los suppliers del DTO
        const { suppliers: supplierIds, ...productData } = createProductDto;
        
        const product = this.repository.create(productData);
        
        // Si hay suppliers, buscarlos y asignarlos
        if (supplierIds && supplierIds.length > 0) {
            const suppliers = await this.supplierRepository.find({
                where: { id: In(supplierIds) },
            });
            product.suppliers = suppliers;
        }
        
        return await this.repository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return await this.repository.find({
            relations: ['brand', 'line', 'suppliers'],
            order: { name: 'ASC' },
        });
    }

    async findByIds(ids: number[]): Promise<Product[]> {
        return await this.repository.findByIds(ids);
    }

    async findAllActive(): Promise<Product[]> {
        return await this.repository.find({
            where: { isActive: true },
            relations: ['brand', 'line', 'suppliers'],
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.repository.findOne({
            where: { id },
            relations: ['brand', 'line', 'suppliers'],
        });

        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        return product;
    }

    async findByName(name: string): Promise<Product | null> {
        return await this.repository.findOne({
            where: { name },
            relations: ['brand', 'line', 'suppliers'],
        });
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto
    ): Promise<Product> {
        const product = await this.findOne(id);

        // Separar los suppliers del DTO
        const { suppliers: supplierIds, ...productData } = updateProductDto;
        
        Object.assign(product, productData);
        
        // Si hay suppliers, actualizarlos
        if (supplierIds !== undefined) {
            if (supplierIds.length > 0) {
                const suppliers = await this.supplierRepository.find({
                    where: { id: In(supplierIds) },
                });
                product.suppliers = suppliers;
            } else {
                product.suppliers = [];
            }
        }
        
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
            relations: ['brand', 'line', 'suppliers'],
            order: { name: 'ASC' },
        });
    }

    async findByLine(lineId: number): Promise<Product[]> {
        return await this.repository.find({
            where: { lineId, isActive: true },
            relations: ['brand', 'line', 'suppliers'],
            order: { name: 'ASC' },
        });
    }
}
