import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sell } from './entities/sell.entity';
import { CreateSellDto } from './dto/create-sell.dto';

@Injectable()
export class SellRepository {
    constructor(
        @InjectRepository(Sell)
        private readonly repository: Repository<Sell>
    ) {}

    async create(createSellDto: CreateSellDto): Promise<Sell> {
        const sell = this.repository.create(createSellDto);
        return await this.repository.save(sell);
    }

    async findOne(id: number): Promise<Sell | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['sellDetails'],
        });
    }

    async findAll(): Promise<Sell[]> {
        return await this.repository.find({
            relations: ['sellDetails'],
        });
    }
}
