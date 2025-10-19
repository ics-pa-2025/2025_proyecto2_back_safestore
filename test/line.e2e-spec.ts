import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { LineController } from '../src/line/line.controller';
import { LineService } from '../src/line/line.service';
import { ResponseLineDto } from '../src/line/dto/response-line.dto';
import { CreateLineDto } from '../src/line/dto/create-line.dto';
import { UpdateLineDto } from '../src/line/dto/update-line.dto';

describe('LineController (e2e)', () => {
    let app: INestApplication<App>;

    const baseLine = (
        overrides: Partial<ResponseLineDto> = {}
    ): ResponseLineDto => ({
        id: overrides.id ?? 1,
        name: overrides.name ?? 'L',
        description: overrides.description ?? '',
        isActive: overrides.isActive ?? true,
    });

    const serviceMock: Partial<LineService> = {
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
    };

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [LineController],
            providers: [{ provide: LineService, useValue: serviceMock }],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /lines -> 201', async () => {
        await request(app.getHttpServer())
            .post('/lines')
            .send({ name: 'New' })
            .expect(201)
            .expect(({ body }: { body: ResponseLineDto }) =>
                expect(body).toMatchObject({ name: 'New' })
            );
    });

    it('GET /lines?active=true -> 200', async () => {
        await request(app.getHttpServer())
            .get('/lines?active=true')
            .expect(200)
            .expect(({ body }: { body: ResponseLineDto[] }) =>
                expect(body[0].id).toBe(2)
            );
    });

    it('GET /lines/search -> 200', async () => {
        await request(app.getHttpServer())
            .get('/lines/search?name=LX')
            .expect(200)
            .expect(({ body }: { body: ResponseLineDto }) =>
                expect(body.name).toBe('LX')
            );
    });

    it('GET /lines/exists/:id -> {exists:true}', async () => {
        await request(app.getHttpServer())
            .get('/lines/exists/1')
            .expect(200)
            .expect(({ body }: { body: { exists: boolean } }) =>
                expect(body.exists).toBe(true)
            );
    });

    it('GET /lines/exists-name -> {exists:true}', async () => {
        await request(app.getHttpServer())
            .get('/lines/exists-name?name=L1')
            .expect(200)
            .expect(({ body }: { body: { exists: boolean } }) =>
                expect(body.exists).toBe(true)
            );
    });

    it('GET /lines/:id -> 200', async () => {
        await request(app.getHttpServer())
            .get('/lines/1')
            .expect(200)
            .expect(({ body }: { body: ResponseLineDto }) =>
                expect(body.id).toBe(1)
            );
    });

    it('PATCH /lines/:id -> 200', async () => {
        await request(app.getHttpServer())
            .patch('/lines/1')
            .send({ name: 'Edited' })
            .expect(200)
            .expect(({ body }: { body: ResponseLineDto }) =>
                expect(body.name).toBe('Edited')
            );
    });

    it('PATCH /lines/:id/restore -> 200', async () => {
        await request(app.getHttpServer())
            .patch('/lines/1/restore')
            .expect(200)
            .expect(({ body }: { body: ResponseLineDto }) =>
                expect(body.isActive).toBe(true)
            );
    });

    it('DELETE /lines/:id -> 204', async () => {
        await request(app.getHttpServer()).delete('/lines/1').expect(204);
    });

    it('DELETE /lines/:id/soft -> 200', async () => {
        await request(app.getHttpServer())
            .delete('/lines/1/soft')
            .expect(200)
            .expect(({ body }: { body: ResponseLineDto }) =>
                expect(body.isActive).toBe(false)
            );
    });
});
