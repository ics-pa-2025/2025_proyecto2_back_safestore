import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { SellModule } from '../sell/sell.module';
import { HttpModule } from '@nestjs/axios';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [SellModule, HttpModule, ProductModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
