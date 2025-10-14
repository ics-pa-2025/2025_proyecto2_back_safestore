import { Module } from '@nestjs/common';
import { SellService } from './sell.service';
import { SellController } from './sell.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sell } from './entities/sell.entity';
import { SellDetail } from '../sell-detail/entities/sell-detail.entity';
import { SellRepository } from './sell.repository';
import { ProductModule } from '../product/product.module';
import { SellDetailModule } from '../sell-detail/sell-detail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sell, SellDetail]),
        HttpModule,
        ProductModule,
        SellDetailModule,
    ],
    controllers: [SellController],
    providers: [SellService, SellRepository],
})
export class SellModule {}
