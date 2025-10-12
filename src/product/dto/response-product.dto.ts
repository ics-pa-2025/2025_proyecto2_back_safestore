import { Exclude, Expose, Type } from 'class-transformer';

class ResponseBrandDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    isActive: boolean;
}

class ResponseLineDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    isActive: boolean;
}

@Exclude()
export class ResponseProductDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    price: number;

    @Expose()
    stock: number;

    @Expose()
    isActive: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    brandId: number;

    @Expose()
    lineId: number;

    @Expose()
    @Type(() => ResponseBrandDto)
    brand: ResponseBrandDto;

    @Expose()
    @Type(() => ResponseLineDto)
    line: ResponseLineDto;

    constructor(partial: Partial<ResponseProductDto>) {
        Object.assign(this, partial);
    }
}
