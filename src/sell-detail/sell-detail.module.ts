import { Module } from '@nestjs/common';
import { SellDetailService } from './sell-detail.service';
import { SellDetailController } from './sell-detail.controller';
import { SellDetailRepository } from './sell-detail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellDetail } from './entities/sell-detail.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SellDetail])],
    controllers: [SellDetailController],
    providers: [SellDetailService, SellDetailRepository],
    exports: [SellDetailService],
})
export class SellDetailModule {}
