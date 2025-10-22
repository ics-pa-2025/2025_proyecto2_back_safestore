import { Test, TestingModule } from '@nestjs/testing';
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsRepository } from './brands.repository';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

describe('BrandsService', () => {
    let service: BrandsService;
    let repo: jest.Mocked<BrandsRepository>;

    const brand: Brand = {
        id: 1,
        name: 'Apple',
        description: 'Desc',
        logo: 'logo.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const repoMock = {
            // repo methods used by service
            findByName: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findActive: jest.fn(),
            findOne: jest.fn(),
            nameExists: jest.fn(),
            update: jest.fn(),
            exists: jest.fn(),
            remove: jest.fn(),
            softDelete: jest.fn(),
        } as unknown as jest.Mocked<BrandsRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BrandsService,
                { provide: BrandsRepository, useValue: repoMock },
            ],
        }).compile();

        service = module.get<BrandsService>(BrandsService);
        repo = module.get(BrandsRepository);
    });

    it('create error', async () => {
        repo.findByName.mockResolvedValue(brand);
        const dto: CreateBrandDto = { name: brand.name };
        await expect(service.create(dto)).rejects.toBeInstanceOf(
            ConflictException
        );
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.findByName).toHaveBeenCalled();
    });

    it('create ok', async () => {
        repo.findByName.mockResolvedValue(null);
        repo.create.mockResolvedValue(brand);
        const dto: CreateBrandDto = { name: brand.name };
        const result = await service.create(dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.create).toHaveBeenCalled();
        expect(result).toMatchObject({ name: brand.name });
    });

    it('findActive ok', async () => {
        repo.findActive.mockResolvedValue([brand]);
        const result = await service.findActive();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.findActive).toHaveBeenCalled();
        expect(result[0]).toMatchObject({ name: brand.name });
    });

    it('findOne error', async () => {
        await expect(service.findOne(0)).rejects.toBeInstanceOf(
            BadRequestException
        );
    });

    it('findOne error not found', async () => {
        repo.findOne.mockResolvedValue(null);
        await expect(service.findOne(1)).rejects.toBeInstanceOf(
            NotFoundException
        );
    });

    it('findOne ok', async () => {
        repo.findOne.mockResolvedValue(brand);
        const result = await service.findOne(1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.findOne).toHaveBeenCalled();
        expect(result).toMatchObject({ name: brand.name });
    });

    it('update error', async () => {
        repo.findOne.mockResolvedValue(null);
        await expect(
            service.update(1, {} as UpdateBrandDto)
        ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('update ok', async () => {
        repo.findOne.mockResolvedValue({ ...brand, name: 'Old' });
        repo.nameExists.mockResolvedValue(false);
        repo.update.mockResolvedValue({ ...brand, name: 'New' });
        const result = await service.update(1, { name: 'New' });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.update).toHaveBeenCalled();
        expect(result).toMatchObject({ name: 'New' });
    });

    it('remove error', async () => {
        await expect(service.remove(0)).rejects.toBeInstanceOf(
            BadRequestException
        );
    });

    it('remove error not found', async () => {
        repo.exists.mockResolvedValue(false);
        await expect(service.remove(1)).rejects.toBeInstanceOf(
            NotFoundException
        );
    });

    it('remove error', async () => {
        repo.exists.mockResolvedValue(true);
        repo.remove.mockResolvedValue(false);
        await expect(service.remove(1)).rejects.toBeInstanceOf(
            BadRequestException
        );
    });

    it('remove ok', async () => {
        repo.exists.mockResolvedValue(true);
        repo.remove.mockResolvedValue(true);
        const res = await service.remove(1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.remove).toHaveBeenCalledWith(1);
        expect(res.message).toMatch(/eliminada/);
    });

    it('softDelete error', async () => {
        repo.exists.mockResolvedValue(true);
        repo.softDelete.mockResolvedValue(false);
        await expect(service.softDelete(1)).rejects.toBeInstanceOf(
            BadRequestException
        );
    });
});
