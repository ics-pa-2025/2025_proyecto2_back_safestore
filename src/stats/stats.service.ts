import { Injectable } from '@nestjs/common';
import { SellPerDayDto } from './dto/sell-per-day.dto';
import { SellService } from 'src/sell/sell.service';
import { ResponseSellDto } from 'src/sell/dto/response-sell.dto';
import { BestSellingProductDto } from './dto/best-selling-product.dto';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { ResponseProductDto } from 'src/product/dto/response-product.dto';

@Injectable()
export class StatsService {

  private sellService : SellService;
  private productService : ProductService;

  constructor(sellService: SellService, productService: ProductService) {
    this.sellService = sellService;
    this.productService = productService;
  } 

async getBestSellingProduct(): Promise<BestSellingProductDto[]> {
    const sales = await this.sellService.findAll();

    const productos = await this.productService.findAll();

    const productSales = this.groupSalesByProduct(sales, productos);

    return this.mapToBestSellingProductDto(productSales);
}

public getNameById(id: number, productos: ResponseProductDto[]): string {
    const producto = productos.find((prod) => prod.id === id);
    return producto ? producto.name : "";
}

private groupSalesByProduct(sales: ResponseSellDto[], productos: ResponseProductDto[]): Map<number, { totalQuantity: number, productName: string }> {
    const salesByProduct = new Map<number, { totalQuantity: number, productName: string }>();
    
    sales.forEach((sale) => {
        sale.sellDetails.forEach((detail) => {
            const currentData = salesByProduct.get(detail.idProducto);
            
            if (currentData) {
                currentData.totalQuantity += detail.cantidad;
            } else {
                // Nota: necesitarás el nombre del producto desde otra fuente
                // o modificar ResponseSellDetailDto para incluirlo
                salesByProduct.set(detail.idProducto, {
                    totalQuantity: detail.cantidad,
                    productName: this.getNameById(detail.idProducto, productos)
                });
            }
        });
    });
    
    return salesByProduct;
}

private mapToBestSellingProductDto(productSales: Map<number, { totalQuantity: number, productName: string }>): BestSellingProductDto[] {
    const bestSellingProducts: BestSellingProductDto[] = [];

    productSales.forEach((data, idProducto) => {
        const dto = new BestSellingProductDto();
        dto.idProduct = idProducto;
        dto.totalSales = data.totalQuantity;
        dto.productName = data.productName;
        bestSellingProducts.push(dto);
    });

    // Ordenar por totalSales descendente
    return bestSellingProducts.sort((a, b) => b.totalSales - a.totalSales);
}
   

  async getSellPerDay(): Promise<SellPerDayDto[]> {
    const sales = await this.sellService.findAll();

    const groupedSales = this.groupSalesByDay(sales);

    return this.mapToSellPerDayDto(groupedSales);
  }

  private groupSalesByDay(sales: ResponseSellDto[]): Map<string, number> {
    const salesByDay = new Map<string, number>();
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt).toISOString().split('T')[0];
      
      const currentTotal = salesByDay.get(date) || 0;
      salesByDay.set(date, currentTotal + parseFloat(sale.total));
    }
    );
    return salesByDay;
  }


  private mapToSellPerDayDto(salesByDay: Map<string, number>): SellPerDayDto[] {
    const sellPerDayDtos: SellPerDayDto[] = [];

    salesByDay.forEach((totalSales, date) => {
      const dto = new SellPerDayDto();
      dto.date = date;
      dto.totalSales = totalSales;
      sellPerDayDtos.push(dto);
    });

    return sellPerDayDtos;
  }

}
