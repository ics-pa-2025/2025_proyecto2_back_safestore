import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { SellDetailService } from '../sell-detail/sell-detail.service';
import { SellRepository } from './sell.repository';
import { RequestSellDto } from './dto/request-sell.dto';
import { CreateSellDetailDto } from '../sell-detail/dto/create-sell-detail.dto';
import { ResponseSellDto } from './dto/response-sell.dto';

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

        //calculamos el total
        let total = 0;
        for (const detalle of requestSellDto.sellDetails) {
            const producto = productosVendidos.find(
                (p) => p.id === detalle.idProduct
            );
            if (producto) {
                total += producto.price * detalle.cantidad;
            }
        }

        const sell = await this.repository.create({
            total: total.toString(),
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
                    productoVendido.price.toString(),
                    productoVendido.id
                );

                createSellDetailDtos.push(createSellDetailDto);
            }
        }

        // creamos el detalle
        console.log(createSellDetailDtos);
        await this.sellDetailService.createForSell(createSellDetailDtos, sell);

        //actualizar stock
        for (const detalle of requestSellDto.sellDetails) {
            const producto = productosVendidos.find(
                (p) => p.id === detalle.idProduct
            );
            if (producto) {
                const nuevoStock = producto.stock - detalle.cantidad;
                await this.productService.updateStock(producto.id, nuevoStock);
            }
        }
    }

    async findAll(): Promise<ResponseSellDto[]> {
        const sellEntity = await this.repository.findAll();
        const sellDto: ResponseSellDto[] = [];

        for (const sell of sellEntity) {
            sellDto.push(new ResponseSellDto(sell));
        }

        return sellDto;
    }
}
