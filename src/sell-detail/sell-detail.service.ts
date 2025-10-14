import { Injectable } from '@nestjs/common';
import { CreateSellDetailDto } from './dto/create-sell-detail.dto';
import { UpdateSellDetailDto } from './dto/update-sell-detail.dto';
import { SellDetailRepository } from './sell-detail.repository';
import { SellDetail } from './entities/sell-detail.entity';
import { Sell } from '../sell/entities/sell.entity';

@Injectable()
export class SellDetailService {
    constructor(private readonly repository: SellDetailRepository) {}

    async create(
        createSellDetailDto: CreateSellDetailDto
    ): Promise<SellDetail> {
        return await this.repository.create(createSellDetailDto);
    }

    async createMany(
        createSellDetailDtos: CreateSellDetailDto[]
    ): Promise<SellDetail[]> {
        return await this.repository.createMany(createSellDetailDtos);
    }

    async createForSell(
        createSellDetailDtos: CreateSellDetailDto[],
        sell: Sell
    ): Promise<SellDetail[]> {
        const detailsWithSell = createSellDetailDtos.map((dto) => ({
            ...dto,
            sell,
        }));
        return await this.repository.createMany(detailsWithSell);
    }

    findAll() {
        return `This action returns all sellDetail`;
    }

    findOne(id: number) {
        return `This action returns a #${id} sellDetail`;
    }

    update(id: number, updateSellDetailDto: UpdateSellDetailDto) {
        return `This action updates a #${id} sellDetail`;
    }

    remove(id: number) {
        return `This action removes a #${id} sellDetail`;
    }
}
