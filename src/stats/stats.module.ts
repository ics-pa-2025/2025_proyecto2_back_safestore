import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { SellModule } from '../sell/sell.module';

@Module({
  imports: [SellModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
