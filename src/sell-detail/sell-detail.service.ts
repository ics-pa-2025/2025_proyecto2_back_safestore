import { Injectable } from '@nestjs/common';
import { CreateSellDetailDto } from './dto/create-sell-detail.dto';
import { UpdateSellDetailDto } from './dto/update-sell-detail.dto';

@Injectable()
export class SellDetailService {
  create(createSellDetailDto: CreateSellDetailDto) {
    return 'This action adds a new sellDetail';
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
