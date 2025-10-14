import { Injectable } from '@nestjs/common';
import { CreateSellDto } from './dto/create-sell.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class SellService {
    constructor(private productService: ProductService) {}

    create(createSellDto: CreateSellDto, userId: string) {
        // const productosVendidos = this.productService.

        console.log(createSellDto);
        console.log(userId);
        return 'This action adds a new sell';
    }
}
