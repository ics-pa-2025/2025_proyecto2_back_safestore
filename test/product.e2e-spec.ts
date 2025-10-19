import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductController } from '../src/product/product.controller';
import { ProductService } from '../src/product/product.service';
import { ResponseProductDto } from '../src/product/dto/response-product.dto';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import { UpdateProductDto } from '../src/product/dto/update-product.dto';
import { ResponseBrandDto } from '../src/brands/dto/response-brand.dto';
import { ResponseLineDto } from '../src/line/dto/response-line.dto';

describe('ProductController (e2e)', () => {
    let app: INestApplication<App>;

    const baseProduct = (
        overrides: Partial<ResponseProductDto> = {}
    ): ResponseProductDto => ({
        id: overrides.id ?? 1,
        name: overrides.name ?? 'P',
        description: overrides.description ?? '',
        price: overrides.price ?? 10,
        stock: overrides.stock ?? 1,
        isActive: overrides.isActive ?? true,
        createdAt: overrides.createdAt ?? new Date(),
        updatedAt: overrides.updatedAt ?? new Date(),
        brandId: overrides.brandId ?? 1,
        lineId: overrides.lineId ?? 1,
        brand:
            overrides.brand ??
            ({
                id: 1,
                name: 'B',
                description: '',
                logo: '',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as ResponseBrandDto),
        line:
            overrides.line ??
            ({
                id: 1,
                name: 'L',
                description: '',
                isActive: true,
            } as ResponseLineDto),
    });

    const serviceMock: Partial<ProductService> = {
        create: jest.fn((dto: CreateProductDto) =>
            Promise.resolve(
                baseProduct({
                    name: dto.name,
                    description: dto.description,
                    price: dto.price,
                    stock: dto.stock,
                    brandId: dto.brandId,
                    lineId: dto.lineId,
                })
            )
        ),
        findAll: jest.fn(() =>
            Promise.resolve([baseProduct({ id: 1, name: 'P1' })])
        ),
        findAllActive: jest.fn(() =>
            Promise.resolve([baseProduct({ id: 2, name: 'P2' })])
        ),
        findOne: jest.fn((id: number) => Promise.resolve(baseProduct({ id }))),
        findByName: jest.fn((name: string) =>
            Promise.resolve(baseProduct({ id: 3, name }))
        ),
        findByBrand: jest.fn(() =>
            Promise.resolve([baseProduct({ id: 4, name: 'B' })])
        ),
        findByLine: jest.fn(() =>
            Promise.resolve([baseProduct({ id: 5, name: 'L' })])
        ),
        update: jest.fn((id: number, dto: UpdateProductDto) =>
            Promise.resolve(
                baseProduct({
                    id,
                    name: dto.name,
                    description: dto.description,
                    price: dto.price as number,
                    stock: dto.stock as number,
                    brandId: dto.brandId as number,
                    lineId: dto.lineId as number,
                })
            )
        ),
        remove: jest.fn(() => Promise.resolve()),
        softDelete: jest.fn((id: number) =>
            Promise.resolve(baseProduct({ id, isActive: false }))
        ),
        restore: jest.fn((id: number) =>
            Promise.resolve(baseProduct({ id, isActive: true }))
        ),
        exists: jest.fn(() => Promise.resolve(true)),
        existsByName: jest.fn(() => Promise.resolve(true)),
        updateStock: jest.fn((id: number, stock: number) =>
            Promise.resolve(baseProduct({ id, stock }))
        ),
    };

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [{ provide: ProductService, useValue: serviceMock }],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /products -> 201', async () => {
        await request(app.getHttpServer())
            .post('/products')
            .send({ name: 'New', price: 10, stock: 1, brandId: 1, lineId: 1 })
            .expect(201)
            .expect(({ body }: { body: ResponseProductDto }) =>
                expect(body).toMatchObject({ name: 'New' })
            );
    });

    it('GET /products?active=true -> active list', async () => {
        await request(app.getHttpServer())
            .get('/products?active=true')
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto[] }) =>
                expect(body[0].id).toBe(2)
            );
    });

    it('GET /products/search?name=abc -> product', async () => {
        await request(app.getHttpServer())
            .get('/products/search?name=abc')
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto }) =>
                expect(body.name).toBe('abc')
            );
    });

    it('GET /products/brand/1 -> list', async () => {
        await request(app.getHttpServer())
            .get('/products/brand/1')
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto[] }) =>
                expect(Array.isArray(body)).toBe(true)
            );
    });

    it('GET /products/line/1 -> list', async () => {
        await request(app.getHttpServer())
            .get('/products/line/1')
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto[] }) =>
                expect(Array.isArray(body)).toBe(true)
            );
    });

    it('GET /products/exists/1 -> {exists:true}', async () => {
        await request(app.getHttpServer())
            .get('/products/exists/1')
            .expect(200)
            .expect(({ body }: { body: { exists: boolean } }) =>
                expect(body.exists).toBe(true)
            );
    });

    it('GET /products/exists-name?name=X -> {exists:true}', async () => {
        await request(app.getHttpServer())
            .get('/products/exists-name?name=X')
            .expect(200)
            .expect(({ body }: { body: { exists: boolean } }) =>
                expect(body.exists).toBe(true)
            );
    });

    it('GET /products/1 -> product', async () => {
        await request(app.getHttpServer())
            .get('/products/1')
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto }) =>
                expect(body.id).toBe(1)
            );
    });

    it('PATCH /products/1 -> updated', async () => {
        await request(app.getHttpServer())
            .patch('/products/1')
            .send({ name: 'Edited' })
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto }) =>
                expect(body.name).toBe('Edited')
            );
    });

    it('PATCH /products/1/stock -> updated stock', async () => {
        await request(app.getHttpServer())
            .patch('/products/1/stock')
            .send({ stock: 20 })
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto }) =>
                expect(body.stock).toBe(20)
            );
    });

    it('PATCH /products/1/restore -> 200', async () => {
        await request(app.getHttpServer())
            .patch('/products/1/restore')
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto }) =>
                expect(body.isActive).toBe(true)
            );
    });

    it('DELETE /products/1 -> 204', async () => {
        await request(app.getHttpServer()).delete('/products/1').expect(204);
    });

    it('DELETE /products/1/soft -> 200', async () => {
        await request(app.getHttpServer())
            .delete('/products/1/soft')
            .expect(200)
            .expect(({ body }: { body: ResponseProductDto }) =>
                expect(body.isActive).toBe(false)
            );
    });
});
