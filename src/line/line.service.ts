import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { ResponseLineDto } from './dto/response-line.dto';
import { LineRepository } from './line.repository';
import { plainToInstance } from 'class-transformer';
import { BrandsRepository } from '../brands/brands.repository';

@Injectable()
export class LineService {
    constructor(
        private readonly lineRepository: LineRepository,
        private readonly brandsRepository: BrandsRepository
    ) {}

    async create(createLineDto: CreateLineDto): Promise<ResponseLineDto> {
        // Verificar si ya existe una línea con el mismo nombre
        const existingLine = await this.lineRepository.findByName(
            createLineDto.name
        );
        if (existingLine) {
            throw new ConflictException(
                `Ya existe una línea con el nombre "${createLineDto.name}"`
            );
        }

        // Verificar que la marca exista y esté activa
        const brandExists = await this.brandsRepository.findOne(
            createLineDto.brandId
        );
        if (!brandExists) {
            throw new NotFoundException(
                `La marca con ID ${createLineDto.brandId} no existe`
            );
        }
        if (!brandExists.isActive) {
            throw new ConflictException(
                `La marca con ID ${createLineDto.brandId} no está activa`
            );
        }

        const line = await this.lineRepository.create(createLineDto);
        return plainToInstance(ResponseLineDto, line);
    }

    async findAll(): Promise<ResponseLineDto[]> {
        const lines = await this.lineRepository.findAll();
        return plainToInstance(ResponseLineDto, lines);
    }

    async findAllActive(): Promise<ResponseLineDto[]> {
        const lines = await this.lineRepository.findAllActive();
        return plainToInstance(ResponseLineDto, lines);
    }

    async findOne(id: number): Promise<ResponseLineDto> {
        const line = await this.lineRepository.findOne(id);
        return plainToInstance(ResponseLineDto, line);
    }

    async findByName(name: string): Promise<ResponseLineDto> {
        const line = await this.lineRepository.findByName(name);
        if (!line) {
            throw new NotFoundException(
                `Línea con nombre "${name}" no encontrada`
            );
        }
        return plainToInstance(ResponseLineDto, line);
    }

    async update(
        id: number,
        updateLineDto: UpdateLineDto
    ): Promise<ResponseLineDto> {
        // Si se está actualizando el nombre, verificar que no exista otra línea con ese nombre
        if (updateLineDto.name) {
            const existsByName = await this.lineRepository.existsByName(
                updateLineDto.name,
                id
            );
            if (existsByName) {
                throw new ConflictException(
                    `Ya existe una línea con el nombre "${updateLineDto.name}"`
                );
            }
        }

        const line = await this.lineRepository.update(id, updateLineDto);
        return plainToInstance(ResponseLineDto, line);
    }

    async remove(id: number): Promise<void> {
        await this.lineRepository.remove(id);
    }

    async softDelete(id: number): Promise<ResponseLineDto> {
        const line = await this.lineRepository.softDelete(id);
        return plainToInstance(ResponseLineDto, line);
    }

    async restore(id: number): Promise<ResponseLineDto> {
        const line = await this.lineRepository.restore(id);
        return plainToInstance(ResponseLineDto, line);
    }

    async exists(id: number): Promise<boolean> {
        return await this.lineRepository.exists(id);
    }

    async existsByName(name: string): Promise<boolean> {
        const line = await this.lineRepository.findByName(name);
        return !!line;
    }
}
