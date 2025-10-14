import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellDetail } from './entities/sell-detail.entity';

@Injectable()
export class SellDetailRepository {
    constructor(
        @InjectRepository(SellDetail)
        private readonly repository: Repository<SellDetail>
    ) {}
}
