import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { SellPerDayDto } from './dto/sell-per-day.dto';
import { BestSellingProductDto } from './dto/best-selling-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';


@Controller('stats')
@UseGuards(AuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("sell-per-day")
  getSellPerDay(): Promise<SellPerDayDto[]> {
    return this.statsService.getSellPerDay();
  }

  @Get("best-selling-product")
  getBestSellingProduct(): Promise<BestSellingProductDto[]> {
    return this.statsService.getBestSellingProduct();
  }

}
