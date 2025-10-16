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
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ResponseBrandDto } from './dto/response-brand.dto';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    )
    async create(
        @Body() createBrandDto: CreateBrandDto
    ): Promise<ResponseBrandDto> {
        return await this.brandsService.create(createBrandDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ResponseBrandDto[]> {
        return await this.brandsService.findAll();
    }

    @Get('active')
    @HttpCode(HttpStatus.OK)
    async findActive(): Promise<ResponseBrandDto[]> {
        return await this.brandsService.findActive();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseBrandDto> {
        return await this.brandsService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @UsePipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    )
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBrandDto: UpdateBrandDto
    ): Promise<ResponseBrandDto> {
        return await this.brandsService.update(id, updateBrandDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<{ message: string }> {
        return await this.brandsService.remove(id);
    }

    @Patch(':id/deactivate')
    @HttpCode(HttpStatus.OK)
    async softDelete(
        @Param('id', ParseIntPipe) id: number
    ): Promise<{ message: string }> {
        return await this.brandsService.softDelete(id);
    }
}
