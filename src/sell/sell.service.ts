import { Injectable } from '@nestjs/common';
import { CreateSellDto } from './dto/create-sell.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class SellService {
    constructor(private productService: ProductService) {}

    async create(createSellDto: CreateSellDto, userId: string) {
        const idsProductos = createSellDto.sellDetails.map(
            (detalle) => detalle.idProduct
        );

        const productosVendidos =
            await this.productService.findByIds(idsProductos);

        console.log(productosVendidos);

        console.log(createSellDto);
        console.log(userId);
        return 'This action adds a new sell';
    }
}
