import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { SellDetailService } from '../sell-detail/sell-detail.service';
import { SellDetail } from '../sell-detail/entities/sell-detail.entity';
import { SellRepository } from './sell.repository';
import { RequestSellDto } from './dto/request-sell.dto';

@Injectable()
export class SellService {
    constructor(
        private productService: ProductService,
        private sellDetailService: SellDetailService,
        private repository: SellRepository
    ) {}

    async create(requestSellDto: RequestSellDto, userId: string) {
        const idsProductos = requestSellDto.sellDetails.map(
            (detalle) => detalle.idProduct
        );

        const productosVendidos =
            await this.productService.findByIds(idsProductos);

        const sell = await this.repository.create({
            total: '0',
            idVendedor: userId,
            idComprador: requestSellDto.idComprador, // si aplica
        });

        console.log(sell);

        // Genero los detalles
        const sellDetails: SellDetail[] = [];
        for (const sellDetail of requestSellDto.sellDetails) {
            console.log(sellDetail);
            const productoVendido = productosVendidos.find((producto) => {
                if (producto.id === sellDetail.idProduct) {
                    return producto;
                }
            });
            if (productoVendido) {
                // const SellDetail =
                //     this.sellDetailService.create(productoVendido);

                console.log('producto vendido' + productoVendido.name);
            }
        }

        return 'This action adds a new sell';
    }
}
