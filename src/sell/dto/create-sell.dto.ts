export class CreateSellDto {
    idComprador?: string;
    sellDetails: { cantidad: number; idProduct: number }[];
}
