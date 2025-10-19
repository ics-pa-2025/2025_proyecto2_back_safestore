import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ResponseBrandDto } from './dto/response-brand.dto';

describe('BrandsController', () => {
    let controller: BrandsController;
    let serviceMock: Partial<BrandsService>;

    const makeBrand = (
        overrides: Partial<ResponseBrandDto> = {}
    ): ResponseBrandDto => ({
        id: overrides.id ?? 1,
        name: overrides.name ?? 'Nike',
        description: overrides.description ?? '',
        logo: overrides.logo ?? '',
        isActive: overrides.isActive ?? true,
        createdAt: overrides.createdAt ?? new Date(),
        updatedAt: overrides.updatedAt ?? new Date(),
    });

    beforeEach(async () => {
        serviceMock = {
            create: jest.fn((dto: CreateBrandDto) =>
                Promise.resolve(makeBrand({ name: dto.name }))
            ),
            findAll: jest.fn(() => Promise.resolve([makeBrand({ id: 1 })])),
            findActive: jest.fn(() =>
                Promise.resolve([makeBrand({ id: 2, isActive: true })])
            ),
            findOne: jest.fn((id: number) =>
                Promise.resolve(makeBrand({ id }))
            ),
            update: jest.fn((id: number, dto: UpdateBrandDto) =>
                Promise.resolve(makeBrand({ id, ...dto }))
            ),
            remove: jest.fn((id: number) =>
                Promise.resolve({
                    message: `Marca con ID ${id} eliminada correctamente`,
                })
            ),
            softDelete: jest.fn((id: number) =>
                Promise.resolve({
                    message: `Marca con ID ${id} desactivada correctamente`,
                })
            ),
        } as Partial<BrandsService>;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BrandsController],
            providers: [{ provide: BrandsService, useValue: serviceMock }],
        }).compile();

        controller = module.get<BrandsController>(BrandsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create ok', async () => {
        const dto: CreateBrandDto = { name: 'New', description: '', logo: '' };
        const result = await controller.create(dto);
        expect(result).toMatchObject({ id: 1, name: 'New' });
        expect(serviceMock.create).toHaveBeenCalledWith(dto);
    });

    it('findAll ok', async () => {
        const result = await controller.findAll();
        expect(Array.isArray(result)).toBe(true);
        expect(serviceMock.findAll).toHaveBeenCalled();
    });

    it('findActive ok', async () => {
        const result = await controller.findActive();
        expect(result[0].isActive).toBe(true);
        expect(serviceMock.findActive).toHaveBeenCalled();
    });

    it('findOne ok', async () => {
        const result = await controller.findOne(10);
        expect(result.id).toBe(10);
        expect(serviceMock.findOne).toHaveBeenCalledWith(10);
    });

    it('update ok', async () => {
        const dto: UpdateBrandDto = { name: 'Edited' };
        const result = await controller.update(5, dto);
        expect(result).toMatchObject({ id: 5, name: 'Edited' });
        expect(serviceMock.update).toHaveBeenCalledWith(5, dto);
    });

    it('remove ok', async () => {
        const result = await controller.remove(3);
        expect(result.message).toMatch(/eliminada/);
        expect(serviceMock.remove).toHaveBeenCalledWith(3);
    });

    it('softDelete ok', async () => {
        const result = await controller.softDelete(7);
        expect(result.message).toMatch(/desactivada/);
        expect(serviceMock.softDelete).toHaveBeenCalledWith(7);
    });
});
