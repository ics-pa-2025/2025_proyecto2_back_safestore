import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { ProductRepository } from './product.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async create(
        createProductDto: CreateProductDto
    ): Promise<ResponseProductDto> {
        // Verificar si ya existe un producto con el mismo nombre
        const existingProduct = await this.productRepository.findByName(
            createProductDto.name
        );
        if (existingProduct) {
            throw new ConflictException(
                `Ya existe un producto con el nombre "${createProductDto.name}"`
            );
        }

        // Validar que el precio y stock sean válidos
        if (createProductDto.price <= 0) {
            throw new BadRequestException('El precio debe ser mayor a 0');
        }

        if (createProductDto.stock < 0) {
            throw new BadRequestException('El stock no puede ser negativo');
        }

        const product = await this.productRepository.create(createProductDto);
        return plainToInstance(ResponseProductDto, product);
    }

    async findAll(): Promise<ResponseProductDto[]> {
        const products = await this.productRepository.findAll();
        return plainToInstance(ResponseProductDto, products);
    }

    async findAllActive(): Promise<ResponseProductDto[]> {
        const products = await this.productRepository.findAllActive();
        return plainToInstance(ResponseProductDto, products);
    }

    async findOne(id: number): Promise<ResponseProductDto> {
        const product = await this.productRepository.findOne(id);
        return plainToInstance(ResponseProductDto, product);
    }

    async findByName(name: string): Promise<ResponseProductDto> {
        const product = await this.productRepository.findByName(name);
        if (!product) {
            throw new NotFoundException(
                `Producto con nombre "${name}" no encontrado`
            );
        }
        return plainToInstance(ResponseProductDto, product);
    }

    async findByBrand(brandId: number): Promise<ResponseProductDto[]> {
        const products = await this.productRepository.findByBrand(brandId);
        return plainToInstance(ResponseProductDto, products);
    }

    async findByLine(lineId: number): Promise<ResponseProductDto[]> {
        const products = await this.productRepository.findByLine(lineId);
        return plainToInstance(ResponseProductDto, products);
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto
    ): Promise<ResponseProductDto> {
        // Si se está actualizando el nombre, verificar que no exista otro producto con ese nombre
        if (updateProductDto.name) {
            const existsByName = await this.productRepository.existsByName(
                updateProductDto.name,
                id
            );
            if (existsByName) {
                throw new ConflictException(
                    `Ya existe un producto con el nombre "${updateProductDto.name}"`
                );
            }
        }

        // Validar precio si se proporciona
        if (
            updateProductDto.price !== undefined &&
            updateProductDto.price <= 0
        ) {
            throw new BadRequestException('El precio debe ser mayor a 0');
        }

        // Validar stock si se proporciona
        if (
            updateProductDto.stock !== undefined &&
            updateProductDto.stock < 0
        ) {
            throw new BadRequestException('El stock no puede ser negativo');
        }

        const product = await this.productRepository.update(
            id,
            updateProductDto
        );
        return plainToInstance(ResponseProductDto, product);
    }

    async remove(id: number): Promise<void> {
        await this.productRepository.remove(id);
    }

    async softDelete(id: number): Promise<ResponseProductDto> {
        const product = await this.productRepository.softDelete(id);
        return plainToInstance(ResponseProductDto, product);
    }

    async restore(id: number): Promise<ResponseProductDto> {
        const product = await this.productRepository.restore(id);
        return plainToInstance(ResponseProductDto, product);
    }

    async exists(id: number): Promise<boolean> {
        return await this.productRepository.exists(id);
    }

    async existsByName(name: string): Promise<boolean> {
        const product = await this.productRepository.findByName(name);
        return !!product;
    }

    async updateStock(
        id: number,
        newStock: number
    ): Promise<ResponseProductDto> {
        if (newStock < 0) {
            throw new BadRequestException('El stock no puede ser negativo');
        }

        const product = await this.productRepository.update(id, {
            stock: newStock,
        });
        return plainToInstance(ResponseProductDto, product);
    }
}
