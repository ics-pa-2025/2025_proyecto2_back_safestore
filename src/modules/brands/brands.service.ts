import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { BrandsRepository } from './brands.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ResponseBrandDto } from './dto/response-brand.dto';
import { ValidationHelper, TransformHelper, EntityHelper, ResponseHelper } from '../../common/helpers';
import { BrandsValidationHelper, BrandsHelper } from './helpers';

@Injectable()
export class BrandsService {
    constructor(private readonly brandsRepository: BrandsRepository) {}

    async create(createBrandDto: CreateBrandDto): Promise<ResponseBrandDto> {
        // Validar que no exista una marca con ese nombre
        await BrandsValidationHelper.validateUniqueNameOnCreate(
            this.brandsRepository,
            createBrandDto.name
        );

        const brand = await this.brandsRepository.create(createBrandDto);
        return TransformHelper.toDto(ResponseBrandDto, brand);
    }

    async findAll(): Promise<ResponseBrandDto[]> {
        const brands = await this.brandsRepository.findAll();
        return TransformHelper.toDtoArray(ResponseBrandDto, brands);
    }

    async findActive(): Promise<ResponseBrandDto[]> {
        const brands = await this.brandsRepository.findActive();
        return TransformHelper.toDtoArray(ResponseBrandDto, brands);
    }

    async findOne(id: number): Promise<ResponseBrandDto> {
        ValidationHelper.validatePositiveId(id);

        const brand = await this.brandsRepository.findOne(id);
        EntityHelper.ensureExists(brand, 'la marca', id);

        return TransformHelper.toDto(ResponseBrandDto, brand);
    }

    async update(
        id: number,
        updateBrandDto: UpdateBrandDto
    ): Promise<ResponseBrandDto> {
        ValidationHelper.validatePositiveId(id);

        // Verificar si la marca existe
        const existingBrand = await this.brandsRepository.findOne(id);
        const validatedBrand = EntityHelper.ensureExists(existingBrand, 'la marca', id);

        // Validar nombre único si se está actualizando
        await BrandsValidationHelper.validateUniqueNameOnUpdate(
            this.brandsRepository,
            updateBrandDto.name,
            id,
            validatedBrand.name
        );

        const updatedBrand = await this.brandsRepository.update(
            id,
            updateBrandDto
        );
        return TransformHelper.toDto(ResponseBrandDto, updatedBrand);
    }

    async remove(id: number): Promise<{ message: string }> {
        ValidationHelper.validatePositiveId(id);

        const exists = await this.brandsRepository.exists(id);
        if (!exists) {
            throw new NotFoundException(BrandsHelper.ERROR_MESSAGES.BRAND_NOT_FOUND(id));
        }

        const deleted = await this.brandsRepository.remove(id);
        BrandsValidationHelper.validateOperationResult(deleted, 'eliminar');

        return ResponseHelper.deleteSuccess('Marca', id);
    }

    async softDelete(id: number): Promise<{ message: string }> {
        ValidationHelper.validatePositiveId(id);

        const exists = await this.brandsRepository.exists(id);
        if (!exists) {
            throw new NotFoundException(BrandsHelper.ERROR_MESSAGES.BRAND_NOT_FOUND(id));
        }

        const deactivated = await this.brandsRepository.softDelete(id);
        BrandsValidationHelper.validateOperationResult(deactivated, 'desactivar');

        return ResponseHelper.deactivateSuccess('Marca', id);
    }
}
