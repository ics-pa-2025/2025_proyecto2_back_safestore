import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { LineService } from './line.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { ResponseLineDto } from './dto/response-line.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('lines')
@UseGuards(AuthGuard)
export class LineController {
    constructor(private readonly lineService: LineService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createLineDto: CreateLineDto
    ): Promise<ResponseLineDto> {
        return await this.lineService.create(createLineDto);
    }

    @Get()
    async findAll(
        @Query('active') active?: string
    ): Promise<ResponseLineDto[]> {
        if (active === 'true') {
            return await this.lineService.findAllActive();
        }
        return await this.lineService.findAll();
    }

    @Get('search')
    async findByName(@Query('name') name: string): Promise<ResponseLineDto> {
        return await this.lineService.findByName(name);
    }

    @Get('exists/:id')
    async exists(
        @Param('id', ParseIntPipe) id: number
    ): Promise<{ exists: boolean }> {
        const exists = await this.lineService.exists(id);
        return { exists };
    }

    @Get('exists-name')
    async existsByName(
        @Query('name') name: string
    ): Promise<{ exists: boolean }> {
        const exists = await this.lineService.existsByName(name);
        return { exists };
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseLineDto> {
        return await this.lineService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateLineDto: UpdateLineDto
    ): Promise<ResponseLineDto> {
        return await this.lineService.update(id, updateLineDto);
    }

    @Patch(':id/restore')
    async restore(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseLineDto> {
        return await this.lineService.restore(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.lineService.remove(id);
    }

    @Delete(':id/soft')
    async softDelete(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseLineDto> {
        return await this.lineService.softDelete(id);
    }
}
