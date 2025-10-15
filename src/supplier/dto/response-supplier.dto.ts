import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseSupplierDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    phone: string;

    @Expose()
    email: string;

    @Expose()
    isActive: boolean;

    constructor(partial: Partial<ResponseSupplierDto>) {
        Object.assign(this, partial);
    }
}
