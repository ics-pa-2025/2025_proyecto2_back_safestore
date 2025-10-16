import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellDetailService } from './sell-detail.service';
import { CreateSellDetailDto } from './dto/create-sell-detail.dto';
import { UpdateSellDetailDto } from './dto/update-sell-detail.dto';

@Controller('sell-detail')
export class SellDetailController {
  constructor(private readonly sellDetailService: SellDetailService) {}

  @Post()
  create(@Body() createSellDetailDto: CreateSellDetailDto) {
    return this.sellDetailService.create(createSellDetailDto);
  }

  @Get()
  findAll() {
    return this.sellDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellDetailDto: UpdateSellDetailDto) {
    return this.sellDetailService.update(+id, updateSellDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellDetailService.remove(+id);
  }
}
