import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { SupplierController } from '../src/supplier/supplier.controller';
import { SupplierService } from '../src/supplier/supplier.service';
import { ResponseSupplierDto } from '../src/supplier/dto/response-supplier.dto';
import { CreateSupplierDto } from '../src/supplier/dto/create-supplier.dto';
import { UpdateSupplierDto } from '../src/supplier/dto/update-supplier.dto';

describe('SupplierController (e2e)', () => {
    let app: INestApplication<App>;

    const baseSupplier = (
        overrides: Partial<ResponseSupplierDto> = {}
    ): ResponseSupplierDto => ({
        id: overrides.id ?? 1,
        name: overrides.name ?? 'S',
        phone: overrides.phone ?? '1',
        email: overrides.email ?? 'a@a.com',
        isActive: overrides.isActive ?? true,
    });

    const serviceMock: Partial<SupplierService> = {
        create: jest.fn((dto: CreateSupplierDto) =>
            Promise.resolve(baseSupplier({ id: 1, ...dto }))
        ),
        findAll: jest.fn(() =>
            Promise.resolve([baseSupplier({ id: 1, name: 'S1' })])
        ),
        findAllActive: jest.fn(() =>
            Promise.resolve([baseSupplier({ id: 2, name: 'S2' })])
        ),
        findOne: jest.fn((id: number) => Promise.resolve(baseSupplier({ id }))),
        findByName: jest.fn((name: string) =>
            Promise.resolve(baseSupplier({ id: 3, name }))
        ),
        update: jest.fn((id: number, dto: UpdateSupplierDto) =>
            Promise.resolve(baseSupplier({ id, ...dto }))
        ),
        remove: jest.fn(() => Promise.resolve()),
        softDelete: jest.fn((id: number) =>
            Promise.resolve(baseSupplier({ id, isActive: false }))
        ),
        restore: jest.fn((id: number) =>
            Promise.resolve(baseSupplier({ id, isActive: true }))
        ),
        exists: jest.fn(() => Promise.resolve(true)),
        existsByName: jest.fn(() => Promise.resolve(true)),
    };

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [SupplierController],
            providers: [{ provide: SupplierService, useValue: serviceMock }],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /suppliers -> 201', async () => {
        await request(app.getHttpServer())
            .post('/suppliers')
            .send({ name: 'New', phone: '1', email: 'e@e.com', isActive: true })
            .expect(201)
            .expect(({ body }: { body: ResponseSupplierDto }) =>
                expect(body).toMatchObject({ name: 'New' })
            );
    });

    it('GET /suppliers?active=true -> 200', async () => {
        await request(app.getHttpServer())
            .get('/suppliers?active=true')
            .expect(200)
            .expect(({ body }: { body: ResponseSupplierDto[] }) =>
                expect(body[0].id).toBe(2)
            );
    });

    it('GET /suppliers/search -> 200', async () => {
        await request(app.getHttpServer())
            .get('/suppliers/search?name=SX')
            .expect(200)
            .expect(({ body }: { body: ResponseSupplierDto }) =>
                expect(body.name).toBe('SX')
            );
    });

    it('GET /suppliers/exists/:id -> {exists:true}', async () => {
        await request(app.getHttpServer())
            .get('/suppliers/exists/1')
            .expect(200)
            .expect(({ body }: { body: { exists: boolean } }) =>
                expect(body.exists).toBe(true)
            );
    });

    it('GET /suppliers/exists-name -> {exists:true}', async () => {
        await request(app.getHttpServer())
            .get('/suppliers/exists-name?name=S1')
            .expect(200)
            .expect(({ body }: { body: { exists: boolean } }) =>
                expect(body.exists).toBe(true)
            );
    });

    it('GET /suppliers/:id -> 200', async () => {
        await request(app.getHttpServer())
            .get('/suppliers/1')
            .expect(200)
            .expect(({ body }: { body: ResponseSupplierDto }) =>
                expect(body.id).toBe(1)
            );
    });

    it('PATCH /suppliers/:id -> 200', async () => {
        await request(app.getHttpServer())
            .patch('/suppliers/1')
            .send({ name: 'Edited' })
            .expect(200)
            .expect(({ body }: { body: ResponseSupplierDto }) =>
                expect(body.name).toBe('Edited')
            );
    });

    it('PATCH /suppliers/:id/restore -> 200', async () => {
        await request(app.getHttpServer())
            .patch('/suppliers/1/restore')
            .expect(200)
            .expect(({ body }: { body: ResponseSupplierDto }) =>
                expect(body.isActive).toBe(true)
            );
    });

    it('DELETE /suppliers/:id -> 204', async () => {
        await request(app.getHttpServer()).delete('/suppliers/1').expect(204);
    });

    it('DELETE /suppliers/:id/soft -> 200', async () => {
        await request(app.getHttpServer())
            .delete('/suppliers/1/soft')
            .expect(200)
            .expect(({ body }: { body: ResponseSupplierDto }) =>
                expect(body.isActive).toBe(false)
            );
    });
});
