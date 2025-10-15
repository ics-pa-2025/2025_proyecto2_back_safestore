import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Line } from '../line/entities/line.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductService', () => {
    let service: ProductService;
    let repo: jest.Mocked<ProductRepository>;

    const brandObj: Brand = {
        id: 1,
        name: 'Acme',
        description: 'Desc',
        logo: 'logo.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const lineObj: Line = {
        id: 1,
        name: 'Línea',
        description: 'Desc',
        isActive: true,
    };

    const product: Product = {
        id: 1,
        name: 'Teclado',
        description: 'Mecánico',
        price: 99.99 as unknown as number,
        stock: 10,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        brandId: 1,
        lineId: 1,
        brand: brandObj,
        line: lineObj,
        suppliers: [],
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
            findByBrand: jest.fn(),
            findByLine: jest.fn(),
        } as unknown as jest.Mocked<ProductRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: ProductRepository, useValue: repoMock },
            ],
        }).compile();

        service = module.get(ProductService);
        repo = module.get(ProductRepository);
    });

    it('create: conflict if duplicate name', async () => {
        repo.findByName.mockResolvedValue(product);
        const dto: CreateProductDto = {
            name: product.name,
            description: 'x',
            price: 10,
            stock: 1,
            brandId: 1,
            lineId: 1,
        };
        await expect(service.create(dto)).rejects.toBeInstanceOf(
            ConflictException
        );
    });

    it('create: invalid price throws', async () => {
        repo.findByName.mockResolvedValue(null);
        const dto: CreateProductDto = {
            name: 'New',
            description: 'x',
            price: 0,
            stock: 1,
            brandId: 1,
            lineId: 1,
        };
        await expect(service.create(dto)).rejects.toBeInstanceOf(
            BadRequestException
        );
    });

    it('create: invalid stock throws', async () => {
        repo.findByName.mockResolvedValue(null);
        const dto: CreateProductDto = {
            name: 'New',
            description: 'x',
            price: 10,
            stock: -1,
            brandId: 1,
            lineId: 1,
        };
        await expect(service.create(dto)).rejects.toBeInstanceOf(
            BadRequestException
        );
    });

    it('create ok', async () => {
        repo.findByName.mockResolvedValue(null);
        repo.create.mockResolvedValue(product);
        const dto: CreateProductDto = {
            name: product.name,
            description: 'x',
            price: 10,
            stock: 1,
            brandId: 1,
            lineId: 1,
        };
        const res = await service.create(dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.create).toHaveBeenCalled();
        expect(res).toMatchObject({ name: product.name });
    });

    it('findByBrand/Line ok', async () => {
        repo.findByBrand.mockResolvedValue([product]);
        expect((await service.findByBrand(1)).length).toBe(1);
        repo.findByLine.mockResolvedValue([product]);
        expect((await service.findByLine(1)).length).toBe(1);
    });

    it('update error', async () => {
        repo.existsByName.mockResolvedValue(true);
        await expect(
            service.update(1, { name: 'Hello' } as UpdateProductDto)
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it('update error', async () => {
        await expect(
            service.update(1, { price: 0 } as UpdateProductDto)
        ).rejects.toBeInstanceOf(BadRequestException);
        await expect(
            service.update(1, { stock: -1 } as UpdateProductDto)
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('update ok', async () => {
        repo.existsByName.mockResolvedValue(false);
        repo.update.mockResolvedValue({ ...product, name: 'New' });
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

        repo.softDelete.mockResolvedValue({ ...product, isActive: false });
        expect((await service.softDelete(1)).isActive).toBe(false);

        repo.restore.mockResolvedValue({ ...product, isActive: true });
        expect((await service.restore(1)).isActive).toBe(true);
    });

    it('exists/existsByName ok', async () => {
        repo.exists.mockResolvedValue(true);
        expect(await service.exists(1)).toBe(true);
        repo.findByName.mockResolvedValue(null);
        expect(await service.existsByName('x')).toBe(false);
        repo.findByName.mockResolvedValue(product);
        expect(await service.existsByName(product.name)).toBe(true);
    });

    it('updateStock ok', async () => {
        await expect(service.updateStock(1, -1)).rejects.toBeInstanceOf(
            BadRequestException
        );
        repo.update.mockResolvedValue({ ...product, stock: 20 });
        const res = await service.updateStock(1, 20);
        expect(res.stock).toBe(20);
    });
});
