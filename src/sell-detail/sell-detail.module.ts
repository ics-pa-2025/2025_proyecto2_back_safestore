import { Module } from '@nestjs/common';
import { SellDetailService } from './sell-detail.service';
import { SellDetailController } from './sell-detail.controller';

@Module({
  controllers: [SellDetailController],
  providers: [SellDetailService],
})
export class SellDetailModule {}
