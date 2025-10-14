import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SellService } from './sell.service';
import { CreateSellDto } from './dto/create-sell.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserId } from '../common/decorators/userId.decorator';

@Controller('sell')
export class SellController {
    constructor(private readonly sellService: SellService) {}

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createSellDto: CreateSellDto, @UserId() userId: string) {
        return this.sellService.create(createSellDto, userId);
    }
}
