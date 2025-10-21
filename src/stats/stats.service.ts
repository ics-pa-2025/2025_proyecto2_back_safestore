import { Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { SellPerDayDto } from './dto/sell-per-day.dto';
import { SellService } from 'src/sell/sell.service';
import { ResponseSellDto } from 'src/sell/dto/response-sell.dto';
import { BestSellingProductDto } from './dto/best-selling-product.dto';

@Injectable()
export class StatsService {

  private sellService : SellService;
  constructor(sellService: SellService) {
    this.sellService = sellService;
  } 

async getBestSellingProduct(): Promise<BestSellingProductDto[]> {
    const sales = await this.sellService.findAll();

    const productSales = this.groupSalesByProduct(sales);

    return this.mapToBestSellingProductDto(productSales);
}

private groupSalesByProduct(sales: ResponseSellDto[]): Map<number, { totalSales: number, productName: string }> {
    const salesByProduct = new Map<number, { totalSales: number, productName: string }>();
    
    sales.forEach((sale) => {
        sale.sellDetails.forEach((detail) => {
            const saleAmount = detail.cantidad * parseFloat(detail.precioUnitario);
            const currentData = salesByProduct.get(detail.idProducto);
            
            if (currentData) {
                currentData.totalSales += saleAmount;
            } else {
                salesByProduct.set(detail.idProducto, {
                    totalSales: saleAmount,
                    productName: `Product ${detail.idProducto}` // Placeholder
                });
            }
        });
    });
    
    return salesByProduct;
}

private mapToBestSellingProductDto(productSales: Map<number, { totalSales: number, productName: string }>): BestSellingProductDto[] {
    const bestSellingProducts: BestSellingProductDto[] = [];

    productSales.forEach((data, idProducto) => {
        const dto = new BestSellingProductDto();
        dto.idProduct = idProducto;
        dto.totalSales = data.totalSales;
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
