import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sell } from './entities/sell.entity';

@Injectable()
export class SellRepository {
    constructor(
        @InjectRepository(Sell)
        private readonly repository: Repository<Sell>
    ) {}
}
