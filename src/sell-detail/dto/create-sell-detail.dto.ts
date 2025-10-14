import { IsInt, IsString, Min } from 'class-validator';

export class CreateSellDetailDto {
    @IsInt()
    @Min(1)
    cantidad: number;

    @IsString()
    precioUnitario: string;

    constructor(cantidad: number, precioUnitario: string) {
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }
}
