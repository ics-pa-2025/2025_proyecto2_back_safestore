import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SellService } from './sell.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserId } from '../common/decorators/userId.decorator';
import { RequestSellDto } from './dto/request-sell.dto';

@Controller('sell')
@UseGuards(AuthGuard)
export class SellController {
    constructor(private readonly sellService: SellService) {}

    @Get()
    findAll() {
        return this.sellService.findAll();
    }

    @Post()
    create(@Body() requestSellDto: RequestSellDto, @UserId() userId: string) {
        return this.sellService.create(requestSellDto, userId);
    }
}
