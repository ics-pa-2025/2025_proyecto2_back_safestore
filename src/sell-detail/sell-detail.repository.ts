import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { SellDetail } from './entities/sell-detail.entity';
import { CreateSellDetailDto } from './dto/create-sell-detail.dto';
import { Sell } from '../sell/entities/sell.entity';

@Injectable()
export class SellDetailRepository {
    constructor(
        @InjectRepository(SellDetail)
        private readonly repository: Repository<SellDetail>
    ) {}

    async create(
        createSellDetailDto: CreateSellDetailDto
    ): Promise<SellDetail> {
        const sellDetail = this.repository.create(createSellDetailDto);
        return await this.repository.save(sellDetail);
    }

    async createMany(
        createSellDetailDtos: CreateSellDetailDto[]
    ): Promise<SellDetail[]> {
        const sellDetails = this.repository.create(createSellDetailDtos);
        return await this.repository.save(sellDetails);
    }

    async findBySellId(sellId: number): Promise<SellDetail[]> {
        return await this.repository.find({
            where: { sell: { id: sellId } },
        });
    }

    async createManyWithSell(
        createSellDetailDtos: CreateSellDetailDto[],
        sell: Sell
    ): Promise<SellDetail[]> {
        const partials: DeepPartial<SellDetail>[] = createSellDetailDtos.map(
            (dto) => ({
                cantidad: dto.cantidad,
                precioUnitario: dto.precioUnitario,
                productId: dto.product_id,
                sell,
            })
        );

        const sellDetails = this.repository.create(partials);
        return await this.repository.save(sellDetails);
    }
}
