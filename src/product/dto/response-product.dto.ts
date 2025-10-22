import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ResponseLineDto } from '../../line/dto/response-line.dto';
import { ResponseBrandDto } from '../../brands/dto/response-brand.dto';

@Exclude()
export class ResponseProductDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    @Transform(({ value }) => parseFloat(value))
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
    imageUrl: string;

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
