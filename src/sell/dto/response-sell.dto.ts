import { ResponseSellDetailDto } from '../../sell-detail/dto/response-sell-detail.dto';
import { Sell } from '../entities/sell.entity';

export class ResponseSellDto {
    id: number;
    total: string;
    createdAt: Date;
    idVendedor: string;
    idComprador: string | null;
    sellDetails: ResponseSellDetailDto[];

    constructor(sell: Sell) {
        this.id = sell.id;
        this.total = sell.total;
        this.createdAt = sell.createdAt;
        this.idVendedor = sell.idVendedor;
        this.idComprador = sell.idComprador;
        this.sellDetails = sell.sellDetails.map((detail) => {
            const detailDto = new ResponseSellDetailDto();
            detailDto.id = detail.id;
            detailDto.cantidad = detail.cantidad;
            detailDto.precioUnitario = detail.precioUnitario;
            return detailDto;
        });
    }
}
