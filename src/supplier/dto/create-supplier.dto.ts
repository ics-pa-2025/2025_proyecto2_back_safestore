export class CreateSupplierDto {
    name: string;
    phone: string;
    email: string;
    isActive: boolean;
    productIds? : number[];
}
    