import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseBrandDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    logo: string;

    @Expose()
    isActive: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<ResponseBrandDto>) {
        Object.assign(this, partial);
    }
}
