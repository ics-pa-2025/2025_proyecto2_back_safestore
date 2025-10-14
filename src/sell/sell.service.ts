import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { SellDetailService } from '../sell-detail/sell-detail.service';
import { SellRepository } from './sell.repository';
import { RequestSellDto } from './dto/request-sell.dto';
import { CreateSellDetailDto } from '../sell-detail/dto/create-sell-detail.dto';

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

        // Genero los detalles
        const createSellDetailDtos: CreateSellDetailDto[] = [];

        for (const sellDetailDto of requestSellDto.sellDetails) {
            const productoVendido = productosVendidos.find((producto) => {
                if (producto.id === sellDetailDto.idProduct) {
                    return producto;
                }
            });
            if (productoVendido) {
                const createSellDetailDto = new CreateSellDetailDto(
                    sellDetailDto.cantidad,
                    productoVendido.price.toString()
                );

                createSellDetailDtos.push(createSellDetailDto);
            }
        }

        const sellDetailEntity = await this.sellDetailService.createForSell(
            createSellDetailDtos,
            sell
        );

        console.log(sellDetailEntity);

        return 'This action adds a new sell';
    }
}
