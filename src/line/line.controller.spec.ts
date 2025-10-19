import { Test, TestingModule } from '@nestjs/testing';
import { LineController } from './line.controller';
import { LineService } from './line.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { ResponseLineDto } from './dto/response-line.dto';

describe('LineController', () => {
    let controller: LineController;
    let serviceMock: Partial<LineService>;

    const baseLine = (
        overrides: Partial<ResponseLineDto> = {}
    ): ResponseLineDto => ({
        id: overrides.id ?? 1,
        name: overrides.name ?? 'Line',
        description: overrides.description ?? '',
        isActive: overrides.isActive ?? true,
    });

    beforeEach(async () => {
        serviceMock = {
            create: jest.fn((dto: CreateLineDto) =>
                Promise.resolve(baseLine({ id: 1, ...dto }))
            ),
            findAll: jest.fn(() =>
                Promise.resolve([baseLine({ id: 1, name: 'L1' })])
            ),
            findAllActive: jest.fn(() =>
                Promise.resolve([baseLine({ id: 2, name: 'L2' })])
            ),
            findOne: jest.fn((id: number) => Promise.resolve(baseLine({ id }))),
            findByName: jest.fn((name: string) =>
                Promise.resolve(baseLine({ id: 3, name }))
            ),
            update: jest.fn((id: number, dto: UpdateLineDto) =>
                Promise.resolve(baseLine({ id, ...dto }))
            ),
            remove: jest.fn(() => Promise.resolve()),
            softDelete: jest.fn((id: number) =>
                Promise.resolve(baseLine({ id, isActive: false }))
            ),
            restore: jest.fn((id: number) =>
                Promise.resolve(baseLine({ id, isActive: true }))
            ),
            exists: jest.fn(() => Promise.resolve(true)),
            existsByName: jest.fn(() => Promise.resolve(true)),
        } as Partial<LineService>;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [LineController],
            providers: [{ provide: LineService, useValue: serviceMock }],
        }).compile();

        controller = module.get<LineController>(LineController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create ok', async () => {
        const dto: CreateLineDto = {
            name: 'New',
            description: '',
            isActive: true,
        };
        const result = await controller.create(dto);
        expect(result).toMatchObject({ id: 1, name: 'New' });
        expect(serviceMock.create).toHaveBeenCalledWith(dto);
    });

    it('findAll ok', async () => {
        const result = await controller.findAll(undefined);
        expect(result[0].name).toBe('L1');
        expect(serviceMock.findAll).toHaveBeenCalled();
    });

    it('findAll(active=true) ok', async () => {
        const result = await controller.findAll('true');
        expect(result[0].id).toBe(2);
        expect(serviceMock.findAllActive).toHaveBeenCalled();
    });

    it('findByName ok', async () => {
        const result = await controller.findByName('XYZ');
        expect(result.name).toBe('XYZ');
        expect(serviceMock.findByName).toHaveBeenCalledWith('XYZ');
    });

    it('exists ok', async () => {
        const result = await controller.exists(9);
        expect(result.exists).toBe(true);
        expect(serviceMock.exists).toHaveBeenCalledWith(9);
    });

    it('existsByName ok', async () => {
        const result = await controller.existsByName('ABC');
        expect(result.exists).toBe(true);
        expect(serviceMock.existsByName).toHaveBeenCalledWith('ABC');
    });

    it('findOne ok', async () => {
        const result = await controller.findOne(10);
        expect(result.id).toBe(10);
        expect(serviceMock.findOne).toHaveBeenCalledWith(10);
    });

    it('update ok', async () => {
        const dto: UpdateLineDto = { name: 'Edited' };
        const result = await controller.update(5, dto);
        expect(result).toMatchObject({ id: 5, name: 'Edited' });
        expect(serviceMock.update).toHaveBeenCalledWith(5, dto);
    });

    it('restore ok', async () => {
        const result = await controller.restore(6);
        expect(result.isActive).toBe(true);
        expect(serviceMock.restore).toHaveBeenCalledWith(6);
    });

    it('remove ok', async () => {
        await controller.remove(3);
        expect(serviceMock.remove).toHaveBeenCalledWith(3);
    });

    it('softDelete ok', async () => {
        const result = await controller.softDelete(7);
        expect(result.isActive).toBe(false);
        expect(serviceMock.softDelete).toHaveBeenCalledWith(7);
    });
});
