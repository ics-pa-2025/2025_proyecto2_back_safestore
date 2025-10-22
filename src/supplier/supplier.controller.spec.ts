import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResponseSupplierDto } from './dto/response-supplier.dto';

describe('SupplierController', () => {
    let controller: SupplierController;
    let serviceMock: Partial<SupplierService>;

    const makeSupplier = (
        overrides: Partial<ResponseSupplierDto> = {}
    ): ResponseSupplierDto => ({
        id: overrides.id ?? 1,
        name: overrides.name ?? 'Supplier',
        phone: overrides.phone ?? '111',
        email: overrides.email ?? 's@s.com',
        isActive: overrides.isActive ?? true,
    });

    beforeEach(async () => {
        serviceMock = {
            create: jest.fn((dto: CreateSupplierDto) =>
                Promise.resolve(makeSupplier({ ...dto }))
            ),
            findAll: jest.fn(() =>
                Promise.resolve([makeSupplier({ id: 1, name: 'S1' })])
            ),
            findAllActive: jest.fn(() =>
                Promise.resolve([makeSupplier({ id: 2, name: 'S2' })])
            ),
            findOne: jest.fn((id: number) =>
                Promise.resolve(makeSupplier({ id }))
            ),
            findByName: jest.fn((name: string) =>
                Promise.resolve(makeSupplier({ id: 3, name }))
            ),
            update: jest.fn((id: number, dto: UpdateSupplierDto) =>
                Promise.resolve(makeSupplier({ id, ...dto }))
            ),
            remove: jest.fn(() => Promise.resolve()),
            softDelete: jest.fn((id: number) =>
                Promise.resolve(makeSupplier({ id, isActive: false }))
            ),
            restore: jest.fn((id: number) =>
                Promise.resolve(makeSupplier({ id, isActive: true }))
            ),
            exists: jest.fn(() => Promise.resolve(true)),
            existsByName: jest.fn(() => Promise.resolve(true)),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [SupplierController],
            providers: [{ provide: SupplierService, useValue: serviceMock }],
        }).compile();

        controller = module.get<SupplierController>(SupplierController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create ok', async () => {
        const dto: CreateSupplierDto = {
            name: 'New',
            phone: '1',
            email: 'e@e.com',
            isActive: true,
        };
        const result = await controller.create(dto);
        expect(result).toMatchObject({ id: 1, name: 'New' });
        expect(serviceMock.create).toHaveBeenCalledWith(dto);
    });

    it('findAll ok', async () => {
        const result = await controller.findAll();
        expect(Array.isArray(result)).toBe(true);
        expect(serviceMock.findAll).toHaveBeenCalled();
    });

    it('findAll ok', async () => {
        const result = await controller.findAll('true');
        expect(result[0].id).toBe(2);
        expect(serviceMock.findAllActive).toHaveBeenCalled();
    });

    it('findByName ok', async () => {
        const result = await controller.findByName('SX');
        expect(result.name).toBe('SX');
        expect(serviceMock.findByName).toHaveBeenCalledWith('SX');
    });

    it('exists ok', async () => {
        const res = await controller.exists(1);
        expect(res.exists).toBe(true);
        expect(serviceMock.exists).toHaveBeenCalledWith(1);
    });

    it('existsByName ok', async () => {
        const res = await controller.existsByName('A');
        expect(res.exists).toBe(true);
        expect(serviceMock.existsByName).toHaveBeenCalledWith('A');
    });

    it('findOne ok', async () => {
        const result = await controller.findOne(10);
        expect(result.id).toBe(10);
        expect(serviceMock.findOne).toHaveBeenCalledWith(10);
    });

    it('update ok', async () => {
        const dto: UpdateSupplierDto = { name: 'Edited' };
        const result = await controller.update(5, dto);
        expect(result).toMatchObject({ id: 5, name: 'Edited' });
        expect(serviceMock.update).toHaveBeenCalledWith(5, dto);
    });

    it('restore ok', async () => {
        const res = await controller.restore(7);
        expect(res.isActive).toBe(true);
        expect(serviceMock.restore).toHaveBeenCalledWith(7);
    });

    it('remove ok', async () => {
        const res = await controller.remove(3);
        expect(res).toBeUndefined();
        expect(serviceMock.remove).toHaveBeenCalledWith(3);
    });

    it('softDelete ok', async () => {
        const res = await controller.softDelete(8);
        expect(res.isActive).toBe(false);
        expect(serviceMock.softDelete).toHaveBeenCalledWith(8);
    });
});
