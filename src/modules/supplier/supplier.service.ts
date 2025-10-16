import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResponseSupplierDto } from './dto/response-supplier.dto';
import { SupplierRepository } from './supplier.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SupplierService {
    constructor(private readonly supplierRepository: SupplierRepository) {}

    async create(
        createSupplierDto: CreateSupplierDto
    ): Promise<ResponseSupplierDto> {
        // Verificar si ya existe un proveedor con el mismo nombre
        const existingSupplier = await this.supplierRepository.findByName(
            createSupplierDto.name
        );
        if (existingSupplier) {
            throw new ConflictException(
                `Ya existe un Proveedor con el nombre "${createSupplierDto.name}"`
            );
        }

        const supplier =
            await this.supplierRepository.create(createSupplierDto);
        return plainToInstance(ResponseSupplierDto, supplier);
    }

    async findAll(): Promise<ResponseSupplierDto[]> {
        const suppliers = await this.supplierRepository.findAll();
        return plainToInstance(ResponseSupplierDto, suppliers);
    }

    async findAllActive(): Promise<ResponseSupplierDto[]> {
        const suppliers = await this.supplierRepository.findAllActive();
        return plainToInstance(ResponseSupplierDto, suppliers);
    }

    async findOne(id: number): Promise<ResponseSupplierDto> {
        const supplier = await this.supplierRepository.findOne(id);
        return plainToInstance(ResponseSupplierDto, supplier);
    }

    async findByName(name: string): Promise<ResponseSupplierDto> {
        const supplier = await this.supplierRepository.findByName(name);
        if (!supplier) {
            throw new NotFoundException(
                `Proveedor con nombre "${name}" no encontrado`
            );
        }
        return plainToInstance(ResponseSupplierDto, supplier);
    }

    async update(
        id: number,
        updateSupplierDto: UpdateSupplierDto
    ): Promise<ResponseSupplierDto> {
        // Si se está actualizando el nombre, verificar que no exista otro proveedor con ese nombre
        if (updateSupplierDto.name) {
            const existsByName = await this.supplierRepository.existsByName(
                updateSupplierDto.name,
                id
            );
            if (existsByName) {
                throw new ConflictException(
                    `Ya existe un proveedor con el nombre "${updateSupplierDto.name}"`
                );
            }
        }

        const supplier = await this.supplierRepository.update(
            id,
            updateSupplierDto
        );
        return plainToInstance(ResponseSupplierDto, supplier);
    }

    async remove(id: number): Promise<void> {
        await this.supplierRepository.remove(id);
    }

    async softDelete(id: number): Promise<ResponseSupplierDto> {
        const supplier = await this.supplierRepository.softDelete(id);
        return plainToInstance(ResponseSupplierDto, supplier);
    }

    async restore(id: number): Promise<ResponseSupplierDto> {
        const supplier = await this.supplierRepository.restore(id);
        return plainToInstance(ResponseSupplierDto, supplier);
    }

    async exists(id: number): Promise<boolean> {
        return await this.supplierRepository.exists(id);
    }

    async existsByName(name: string): Promise<boolean> {
        const supplier = await this.supplierRepository.findByName(name);
        return !!supplier;
    }
}
