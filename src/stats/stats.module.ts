import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { SellModule } from '../sell/sell.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SellModule, HttpModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
