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
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResponseSupplierDto } from './dto/response-supplier.dto';

@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createSupplierDto: CreateSupplierDto
    ): Promise<ResponseSupplierDto> {
        return await this.supplierService.create(createSupplierDto);
    }

    @Get()
    async findAll(
        @Query('active') active?: string
    ): Promise<ResponseSupplierDto[]> {
        if (active === 'true') {
            return await this.supplierService.findAllActive();
        }
        return await this.supplierService.findAll();
    }

    @Get('search')
    async findByName(
        @Query('name') name: string
    ): Promise<ResponseSupplierDto> {
        return await this.supplierService.findByName(name);
    }

    @Get('exists/:id')
    async exists(
        @Param('id', ParseIntPipe) id: number
    ): Promise<{ exists: boolean }> {
        const exists = await this.supplierService.exists(id);
        return { exists };
    }

    @Get('exists-name')
    async existsByName(
        @Query('name') name: string
    ): Promise<{ exists: boolean }> {
        const exists = await this.supplierService.existsByName(name);
        return { exists };
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseSupplierDto> {
        return await this.supplierService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSupplierDto: UpdateSupplierDto
    ): Promise<ResponseSupplierDto> {
        return await this.supplierService.update(id, updateSupplierDto);
    }

    @Patch(':id/restore')
    async restore(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseSupplierDto> {
        return await this.supplierService.restore(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.supplierService.remove(id);
    }

    @Delete(':id/soft')
    async softDelete(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseSupplierDto> {
        return await this.supplierService.softDelete(id);
    }
}
