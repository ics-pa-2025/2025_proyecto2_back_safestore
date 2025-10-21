import * as dotenv from 'dotenv';
dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandsService } from './brands.service';
import { BrandsRepository } from './brands.repository';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';

const shouldRunIntegrationTests = !!process.env.DB_HOST;

(shouldRunIntegrationTests ? describe : describe.skip)(
    'BrandsService (integración, PostgreSQL real)',
    () => {
        jest.setTimeout(30000);
        let service: BrandsService;
        let repository: Repository<Brand>;
        let moduleRef: TestingModule;

        beforeAll(async () => {
            if (!process.env.DB_HOST) {
                // No DB configured; tests will be skipped by describe.skip
                return;
            }

            moduleRef = await Test.createTestingModule({
                imports: [
                    TypeOrmModule.forRoot({
                        type: 'postgres',
                        host: process.env.DB_HOST,
                        port: Number(process.env.DB_PORT),
                        username: process.env.DB_USERNAME,
                        password: process.env.DB_PASSWORD,
                        database:
                            process.env.DB_TEST_NAME || process.env.DB_NAME,
                        entities: [Brand],
                        synchronize: true,
                        dropSchema: true,
                        ssl:
                            process.env.DB_SSL === 'true'
                                ? { rejectUnauthorized: false }
                                : false,
                    }),
                    TypeOrmModule.forFeature([Brand]),
                ],
                providers: [BrandsService, BrandsRepository],
            }).compile();

            service = moduleRef.get(BrandsService);
            repository = moduleRef.get(getRepositoryToken(Brand));
        }, 30000);

        afterEach(async () => {
            if (repository) await repository.clear();
        });

        afterAll(async () => {
            if (moduleRef) await moduleRef.close();
        });

        it('create ok', async () => {
            const dto: CreateBrandDto = { name: 'Apple', isActive: true };
            const result = await service.create(dto);
            expect(result.id).toBeDefined();
            expect(result.name).toBe('Apple');
        });

        it('create ok', async () => {
            await service.create({ name: 'aAA' });
            await expect(service.create({ name: 'aAA' })).rejects.toThrow(
                ConflictException
            );
        });

        it('findAll ok', async () => {
            await service.create({ name: 'A' });
            await service.create({ name: 'B' });
            const all = await service.findAll();
            expect(all.length).toBe(2);
        });

        it('findActive ok', async () => {
            await service.create({ name: 'Activa1', isActive: true });
            await service.create({ name: 'Inactiva', isActive: false });
            await service.create({ name: 'Activa2', isActive: true });
            const active = await service.findActive();
            expect(active.every((b) => b.isActive)).toBe(true);
        });

        it('findOne ok', async () => {
            await expect(service.findOne(0)).rejects.toThrow(
                BadRequestException
            );
        });

        it('findOne ok', async () => {
            await expect(service.findOne(999)).rejects.toThrow(
                NotFoundException
            );
        });

        it('findOne ok', async () => {
            const created = await service.create({ name: 'One' });
            const found = await service.findOne(created.id);
            expect(found.name).toBe('One');
        });

        it('update ok', async () => {
            await expect(service.update(0, { name: 'X' })).rejects.toThrow(
                BadRequestException
            );
        });

        it('update ok', async () => {
            await expect(service.update(123, { name: 'X' })).rejects.toThrow(
                NotFoundException
            );
        });

        it('update ok', async () => {
            await service.create({ name: 'A' });
            const b = await service.create({ name: 'B' });
            await expect(service.update(b.id, { name: 'A' })).rejects.toThrow(
                ConflictException
            );
        });

        it('update ok', async () => {
            const created = await service.create({ name: 'Old' });
            const updated = await service.update(created.id, { name: 'New' });
            expect(updated.name).toBe('New');
        });

        it('remove ok', async () => {
            await expect(service.remove(0)).rejects.toThrow(
                BadRequestException
            );
        });

        it('remove ok', async () => {
            await expect(service.remove(321)).rejects.toThrow(
                NotFoundException
            );
        });

        it('remove ok', async () => {
            const created = await service.create({ name: 'Del' });
            const res = await service.remove(created.id);
            expect(res.message).toMatch(/eliminada/);
            const exists = await repository.count({
                where: { id: created.id },
            });
            expect(exists).toBe(0);
        });

        it('softDelete ok', async () => {
            await expect(service.softDelete(654)).rejects.toThrow(
                NotFoundException
            );
        });
    }
);
