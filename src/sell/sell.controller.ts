import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SellService } from './sell.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserId } from '../common/decorators/userId.decorator';
import { RequestSellDto } from './dto/request-sell.dto';

@Controller('sell')
export class SellController {
    constructor(private readonly sellService: SellService) {}

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() requestSellDto: RequestSellDto, @UserId() userId: string) {
        return this.sellService.create(requestSellDto, userId);
    }
}
