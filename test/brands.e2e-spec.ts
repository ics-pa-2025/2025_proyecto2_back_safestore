import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { BrandsController } from '../src/brands/brands.controller';
import { BrandsService } from '../src/brands/brands.service';
import { CreateBrandDto } from '../src/brands/dto/create-brand.dto';
import { UpdateBrandDto } from '../src/brands/dto/update-brand.dto';
import { ResponseBrandDto } from '../src/brands/dto/response-brand.dto';

describe('BrandsController (e2e)', () => {
    let app: INestApplication<App>;

    const makeBrand = (
        overrides: Partial<ResponseBrandDto> = {}
    ): ResponseBrandDto => ({
        id: overrides.id ?? 1,
        name: overrides.name ?? 'Apple',
        description: overrides.description ?? '',
        logo: overrides.logo ?? '',
        isActive: overrides.isActive ?? true,
        createdAt: overrides.createdAt ?? new Date(),
        updatedAt: overrides.updatedAt ?? new Date(),
    });

    const serviceMock: Partial<BrandsService> = {
        create: jest.fn((dto: CreateBrandDto) =>
            Promise.resolve(makeBrand({ name: dto.name }))
        ),
        findAll: jest.fn(() => Promise.resolve([makeBrand()])),
        findActive: jest.fn(() =>
            Promise.resolve([makeBrand({ id: 2, name: 'Active' })])
        ),
        findOne: jest.fn((id: number) => Promise.resolve(makeBrand({ id }))),
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
    };

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [BrandsController],
            providers: [{ provide: BrandsService, useValue: serviceMock }],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /brands -> 201', async () => {
        await request(app.getHttpServer())
            .post('/brands')
            .send({ name: 'New' })
            .expect(201)
            .expect(({ body }: { body: ResponseBrandDto }) => {
                expect(body).toMatchObject({ id: 1, name: 'New' });
            });
    });

    it('GET /brands -> 200', async () => {
        await request(app.getHttpServer())
            .get('/brands')
            .expect(200)
            .expect(({ body }: { body: ResponseBrandDto[] }) => {
                expect(Array.isArray(body)).toBe(true);
            });
    });

    it('GET /brands/active -> 200', async () => {
        await request(app.getHttpServer())
            .get('/brands/active')
            .expect(200)
            .expect(({ body }: { body: ResponseBrandDto[] }) => {
                expect(body[0].name).toBe('Active');
            });
    });

    it('GET /brands/:id -> 200', async () => {
        await request(app.getHttpServer())
            .get('/brands/1')
            .expect(200)
            .expect(({ body }: { body: ResponseBrandDto }) =>
                expect(body.id).toBe(1)
            );
    });

    it('PATCH /brands/:id -> 200', async () => {
        await request(app.getHttpServer())
            .patch('/brands/1')
            .send({ name: 'Edited' })
            .expect(200)
            .expect(({ body }: { body: ResponseBrandDto }) =>
                expect(body.name).toBe('Edited')
            );
    });

    it('DELETE /brands/:id -> 200 with message', async () => {
        await request(app.getHttpServer())
            .delete('/brands/1')
            .expect(200)
            .expect(({ body }: { body: { message: string } }) =>
                expect(body.message).toMatch(/eliminada/)
            );
    });

    it('PATCH /brands/:id/deactivate -> 200 with message', async () => {
        await request(app.getHttpServer())
            .patch('/brands/1/deactivate')
            .expect(200)
            .expect(({ body }: { body: { message: string } }) =>
                expect(body.message).toMatch(/desactivada/)
            );
    });
});
