import { SellDetailDto } from './sell-detail.dto';

export class RequestSellDto {
    idComprador?: string;
    sellDetails: SellDetailDto[];
}
