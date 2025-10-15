import { Test, TestingModule } from '@nestjs/testing';
import { LineService } from './line.service';
import { LineRepository } from './line.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Line } from './entities/line.entity';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';

describe('LineService', () => {
    let service: LineService;
    let repo: jest.Mocked<LineRepository>;

    const line: Line = {
        id: 1,
        name: 'Bebidas',
        description: 'Línea bebidas',
        isActive: true,
    };

    beforeEach(async () => {
        const repoMock = {
            findByName: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findAllActive: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
            exists: jest.fn(),
            existsByName: jest.fn(),
        } as unknown as jest.Mocked<LineRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LineService,
                { provide: LineRepository, useValue: repoMock },
            ],
        }).compile();

        service = module.get(LineService);
        repo = module.get(LineRepository);
    });

    it('create error', async () => {
        repo.findByName.mockResolvedValue(line);
        const dto: CreateLineDto = { name: line.name } as CreateLineDto;
        await expect(service.create(dto)).rejects.toBeInstanceOf(
            ConflictException
        );
    });

    it('create ok', async () => {
        repo.findByName.mockResolvedValue(null);
        repo.create.mockResolvedValue(line);
        const dto: CreateLineDto = { name: line.name } as CreateLineDto;
        const res = await service.create(dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.create).toHaveBeenCalled();
        expect(res).toMatchObject({ name: line.name });
    });

    it('findAll ok', async () => {
        repo.findAll.mockResolvedValue([line]);
        const res = await service.findAll();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.findAll).toHaveBeenCalled();
        expect(res[0]).toMatchObject({ name: line.name });
    });

    it('findAllActive ok', async () => {
        repo.findAllActive.mockResolvedValue([line]);
        const res = await service.findAllActive();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.findAllActive).toHaveBeenCalled();
        expect(res[0]).toMatchObject({ name: line.name });
    });

    it('findOne ok', async () => {
        repo.findOne.mockResolvedValue(line);
        const res = await service.findOne(1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.findOne).toHaveBeenCalled();
        expect(res).toMatchObject({ name: line.name });
    });

    it('findByName not found expected', async () => {
        repo.findByName.mockResolvedValue(null);
        await expect(service.findByName('x')).rejects.toBeInstanceOf(
            NotFoundException
        );
    });

    it('findByName ok', async () => {
        repo.findByName.mockResolvedValue(line);
        const res = await service.findByName(line.name);
        expect(res).toMatchObject({ name: line.name });
    });

    it('update error', async () => {
        repo.existsByName.mockResolvedValue(true);
        await expect(
            service.update(1, { name: 'asdaawd' } as UpdateLineDto)
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it('update ok', async () => {
        repo.existsByName.mockResolvedValue(false);
        repo.update.mockResolvedValue({ ...line, name: 'New' });
        const res = await service.update(1, { name: 'New' });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.update).toHaveBeenCalled();
        expect(res).toMatchObject({ name: 'New' });
    });

    it('remove ok', async () => {
        repo.remove.mockResolvedValue();
        await service.remove(1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repo.remove).toHaveBeenCalledWith(1);
    });

    it('exists ok', async () => {
        repo.exists.mockResolvedValue(true);
        expect(await service.exists(1)).toBe(true);
        repo.exists.mockResolvedValue(false);
        expect(await service.exists(2)).toBe(false);
    });

    it('existsByName ok', async () => {
        repo.findByName.mockResolvedValue(line);
        expect(await service.existsByName(line.name)).toBe(true);
        repo.findByName.mockResolvedValue(null);
        expect(await service.existsByName('x')).toBe(false);
    });
});
