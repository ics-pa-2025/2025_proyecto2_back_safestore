import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { BrandsRepository } from './brands.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ResponseBrandDto } from './dto/response-brand.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BrandsService {
    constructor(private readonly brandsRepository: BrandsRepository) {}

    async create(createBrandDto: CreateBrandDto): Promise<ResponseBrandDto> {
        // Verificar si ya existe una marca con ese nombre
        const existingBrand = await this.brandsRepository.findByName(
            createBrandDto.name
        );
        if (existingBrand) {
            throw new ConflictException(
                `Ya existe una marca con el nombre "${createBrandDto.name}"`
            );
        }

        const brand = await this.brandsRepository.create(createBrandDto);
        return plainToClass(ResponseBrandDto, brand, {
            excludeExtraneousValues: true,
        });
    }

    async findAll(): Promise<ResponseBrandDto[]> {
        const brands = await this.brandsRepository.findAll();
        return brands.map((brand) =>
            plainToClass(ResponseBrandDto, brand, {
                excludeExtraneousValues: true,
            })
        );
    }

    async findActive(): Promise<ResponseBrandDto[]> {
        const brands = await this.brandsRepository.findActive();
        return brands.map((brand) =>
            plainToClass(ResponseBrandDto, brand, {
                excludeExtraneousValues: true,
            })
        );
    }

    async findOne(id: number): Promise<ResponseBrandDto> {
        if (!id || id <= 0) {
            throw new BadRequestException('El ID debe ser un número positivo');
        }

        const brand = await this.brandsRepository.findOne(id);
        if (!brand) {
            throw new NotFoundException(`No se encontró la marca con ID ${id}`);
        }

        return plainToClass(ResponseBrandDto, brand, {
            excludeExtraneousValues: true,
        });
    }

    async update(
        id: number,
        updateBrandDto: UpdateBrandDto
    ): Promise<ResponseBrandDto> {
        if (!id || id <= 0) {
            throw new BadRequestException('El ID debe ser un número positivo');
        }

        // Verificar si la marca existe
        const existingBrand = await this.brandsRepository.findOne(id);
        if (!existingBrand) {
            throw new NotFoundException(`No se encontró la marca con ID ${id}`);
        }

        // Si se está actualizando el nombre, verificar que no exista otra marca con ese nombre
        if (updateBrandDto.name && updateBrandDto.name !== existingBrand.name) {
            const nameExists = await this.brandsRepository.nameExists(
                updateBrandDto.name,
                id
            );
            if (nameExists) {
                throw new ConflictException(
                    `Ya existe otra marca con el nombre "${updateBrandDto.name}"`
                );
            }
        }

        const updatedBrand = await this.brandsRepository.update(
            id,
            updateBrandDto
        );
        return plainToClass(ResponseBrandDto, updatedBrand, {
            excludeExtraneousValues: true,
        });
    }

    async remove(id: number): Promise<{ message: string }> {
        if (!id || id <= 0) {
            throw new BadRequestException('El ID debe ser un número positivo');
        }

        const exists = await this.brandsRepository.exists(id);
        if (!exists) {
            throw new NotFoundException(`No se encontró la marca con ID ${id}`);
        }

        const deleted = await this.brandsRepository.remove(id);
        if (!deleted) {
            throw new BadRequestException('No se pudo eliminar la marca');
        }

        return { message: `Marca con ID ${id} eliminada correctamente` };
    }

    async softDelete(id: number): Promise<{ message: string }> {
        if (!id || id <= 0) {
            throw new BadRequestException('El ID debe ser un número positivo');
        }

        const exists = await this.brandsRepository.exists(id);
        if (!exists) {
            throw new NotFoundException(`No se encontró la marca con ID ${id}`);
        }

        const deactivated = await this.brandsRepository.softDelete(id);
        if (!deactivated) {
            throw new BadRequestException('No se pudo desactivar la marca');
        }

        return { message: `Marca con ID ${id} desactivada correctamente` };
    }
}
