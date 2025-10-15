import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { SupplierRepository } from './supplier.repository';
import { ConflictException } from '@nestjs/common';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

describe('SupplierService', () => {
    let service: SupplierService;
    let repo: jest.Mocked<SupplierRepository>;

    const supplier: Supplier = {
        id: 1,
        name: 'ACME Supp',
        phone: '123',
        email: 'a@a.com',
        isActive: true,
        products: [],
    };

    beforeEach(async () => {
        const repoMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllActive: jest.fn(),
            findOne: jest.fn(),
            findByName: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
            exists: jest.fn(),
            existsByName: jest.fn(),
        } as unknown as jest.Mocked<SupplierRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SupplierService,
                { provide: SupplierRepository, useValue: repoMock },
            ],
        }).compile();

        service = module.get(SupplierService);
        repo = module.get(SupplierRepository);
    });

    it('create error', async () => {
        repo.findByName.mockResolvedValue(supplier);
        const dto: CreateSupplierDto = {
            name: supplier.name,
            phone: '1',
            email: 'e@e.com',
            isActive: true,
        };
        await expect(service.create(dto)).rejects.toBeInstanceOf(
            ConflictException
        );
    });

    it('create ok', async () => {
        repo.findByName.mockResolvedValue(null);
        repo.create.mockResolvedValue(supplier);
        const dto: CreateSupplierDto = {
            name: 'New',
            phone: '1',
            email: 'e@e.com',
            isActive: true,
        };
        const res = await service.create(dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.create).toHaveBeenCalled();
        expect(res).toMatchObject({ name: 'New' });
    });

    it('update error', async () => {
        repo.existsByName.mockResolvedValue(true);
        await expect(
            service.update(1, { name: 'Hello' } as UpdateSupplierDto)
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it('update ok', async () => {
        repo.existsByName.mockResolvedValue(false);
        repo.update.mockResolvedValue({ ...supplier, name: 'New' });
        const res = await service.update(1, { name: 'New' });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.update).toHaveBeenCalled();
        expect(res).toMatchObject({ name: 'New' });
    });

    it('remove/softDelete/restore ok', async () => {
        repo.remove.mockResolvedValue();
        await service.remove(1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.remove).toHaveBeenCalledWith(1);

        repo.softDelete.mockResolvedValue({ ...supplier, isActive: false });
        expect((await service.softDelete(1)).isActive).toBe(false);

        repo.restore.mockResolvedValue({ ...supplier, isActive: true });
        expect((await service.restore(1)).isActive).toBe(true);
    });

    it('exists/existsByName ok', async () => {
        repo.exists.mockResolvedValue(true);
        expect(await service.exists(1)).toBe(true);
        repo.findByName.mockResolvedValue(null);
        expect(await service.existsByName('x')).toBe(false);
        repo.findByName.mockResolvedValue(supplier);
        expect(await service.existsByName(supplier.name)).toBe(true);
    });
});
