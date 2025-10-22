import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseLineDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    isActive: boolean;

    @Expose()
    brandId: number;

    constructor(partial: Partial<ResponseLineDto>) {
        Object.assign(this, partial);
    }
}
