import { IsInt, IsString, Min } from 'class-validator';

export class CreateSellDetailDto {
    @IsInt()
    @Min(1)
    cantidad: number;

    @IsString()
    precioUnitario: string;

    product_id: number;

    constructor(cantidad: number, precioUnitario: string, product_id: number) {
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.product_id = product_id;
    }
}
