import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { ResponseBrandDto } from '../brands/dto/response-brand.dto';
import { ResponseLineDto } from '../line/dto/response-line.dto';

describe('ProductController', () => {
    let controller: ProductController;
    let serviceMock: Partial<ProductService>;

    const baseProduct = (
        overrides: Partial<ResponseProductDto> = {}
    ): ResponseProductDto => ({
        id: overrides.id ?? 1,
        name: overrides.name ?? 'P',
        description: overrides.description ?? '',
        price: overrides.price ?? 10,
        stock: overrides.stock ?? 1,
        isActive: overrides.isActive ?? true,
        createdAt: overrides.createdAt ?? new Date(),
        updatedAt: overrides.updatedAt ?? new Date(),
        brandId: overrides.brandId ?? 1,
        lineId: overrides.lineId ?? 1,
        brand:
            overrides.brand ??
            ({
                id: 1,
                name: 'B',
                description: '',
                logo: '',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as ResponseBrandDto),
        line:
            overrides.line ??
            ({
                id: 1,
                name: 'L',
                description: '',
                isActive: true,
            } as ResponseLineDto),
    });

    beforeEach(async () => {
        serviceMock = {
            create: jest.fn((dto: CreateProductDto) =>
                Promise.resolve(
                    baseProduct({
                        name: dto.name,
                        description: dto.description,
                        price: dto.price,
                        stock: dto.stock,
                        brandId: dto.brandId,
                        lineId: dto.lineId,
                    })
                )
            ),
            findAll: jest.fn(() =>
                Promise.resolve([baseProduct({ id: 1, name: 'P1' })])
            ),
            findAllActive: jest.fn(() =>
                Promise.resolve([baseProduct({ id: 2, name: 'P2' })])
            ),
            findOne: jest.fn((id: number) =>
                Promise.resolve(baseProduct({ id }))
            ),
            findByName: jest.fn((name: string) =>
                Promise.resolve(baseProduct({ id: 3, name }))
            ),
            findByBrand: jest.fn((brandId: number) =>
                Promise.resolve([baseProduct({ id: brandId, name: 'PB' })])
            ),
            findByLine: jest.fn((lineId: number) =>
                Promise.resolve([baseProduct({ id: lineId, name: 'PL' })])
            ),
            update: jest.fn((id: number, dto: UpdateProductDto) =>
                Promise.resolve(
                    baseProduct({
                        id,
                        name: dto.name,
                        description: dto.description,
                        price: (dto.price as number) ?? 10,
                        stock: (dto.stock as number) ?? 1,
                        brandId: (dto.brandId as number) ?? 1,
                        lineId: (dto.lineId as number) ?? 1,
                    })
                )
            ),
            remove: jest.fn(() => Promise.resolve()),
            softDelete: jest.fn((id: number) =>
                Promise.resolve(baseProduct({ id, isActive: false }))
            ),
            restore: jest.fn((id: number) =>
                Promise.resolve(baseProduct({ id, isActive: true }))
            ),
            exists: jest.fn(() => Promise.resolve(true)),
            existsByName: jest.fn(() => Promise.resolve(true)),
            updateStock: jest.fn((id: number, stock: number) =>
                Promise.resolve(baseProduct({ id, stock }))
            ),
        } as Partial<ProductService>;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [{ provide: ProductService, useValue: serviceMock }],
        }).compile();

        controller = module.get<ProductController>(ProductController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create ok', async () => {
        const dto: CreateProductDto = {
            name: 'New',
            description: '',
            price: 10,
            stock: 1,
            brandId: 1,
            lineId: 1,
        };
        const result = await controller.create(dto);
        expect(result).toMatchObject({ id: 1, name: 'New' });
        expect(serviceMock.create).toHaveBeenCalledWith(dto);
    });

    it('findAll ok', async () => {
        const result = await controller.findAll('true');
        expect(Array.isArray(result)).toBe(true);
        expect(serviceMock.findAllActive).toHaveBeenCalled();
    });

    it('findAll ok', async () => {
        const result = await controller.findAll(undefined);
        expect(Array.isArray(result)).toBe(true);
        expect(serviceMock.findAll).toHaveBeenCalled();
    });

    it('findByName ok', async () => {
        const result = await controller.findByName('X');
        expect(result.name).toBe('X');
        expect(serviceMock.findByName).toHaveBeenCalledWith('X');
    });

    it('findByBrand ok', async () => {
        const result = await controller.findByBrand(5);
        expect(Array.isArray(result)).toBe(true);
        expect(serviceMock.findByBrand).toHaveBeenCalledWith(5);
    });

    it('findByLine ok', async () => {
        const result = await controller.findByLine(9);
        expect(Array.isArray(result)).toBe(true);
        expect(serviceMock.findByLine).toHaveBeenCalledWith(9);
    });

    it('exists ok', async () => {
        const result = await controller.exists(1);
        expect(result.exists).toBe(true);
        expect(serviceMock.exists).toHaveBeenCalledWith(1);
    });

    it('existsByName ok', async () => {
        const result = await controller.existsByName('P1');
        expect(result.exists).toBe(true);
        expect(serviceMock.existsByName).toHaveBeenCalledWith('P1');
    });

    it('findOne ok', async () => {
        const result = await controller.findOne(10);
        expect(result.id).toBe(10);
        expect(serviceMock.findOne).toHaveBeenCalledWith(10);
    });

    it('update ok', async () => {
        const dto: UpdateProductDto = { name: 'Edited' };
        const result = await controller.update(3, dto);
        expect(result).toMatchObject({ id: 3, name: 'Edited' });
        expect(serviceMock.update).toHaveBeenCalledWith(3, dto);
    });

    it('updateStock ok', async () => {
        const result = await controller.updateStock(3, 99);
        expect(result.stock).toBe(99);
        expect(serviceMock.updateStock).toHaveBeenCalledWith(3, 99);
    });

    it('restore ok', async () => {
        const result = await controller.restore(4);
        expect(result.isActive).toBe(true);
        expect(serviceMock.restore).toHaveBeenCalledWith(4);
    });

    it('remove ok', async () => {
        const result = await controller.remove(6);
        expect(result).toBeUndefined();
        expect(serviceMock.remove).toHaveBeenCalledWith(6);
    });

    it('softDelete ok', async () => {
        const result = await controller.softDelete(7);
        expect(result.isActive).toBe(false);
        expect(serviceMock.softDelete).toHaveBeenCalledWith(7);
    });
});
