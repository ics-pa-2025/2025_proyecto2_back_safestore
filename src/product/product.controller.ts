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
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadService } from 'src/common/services/upload.service';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly uploadService: UploadService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<ResponseProductDto> {
        if (file) {
            createProductDto.imageUrl = this.uploadService.getImageUrl(file.filename);
        }
        return await this.productService.create(createProductDto);
    }

    @Get()
    async findAll(
        @Query('active') active?: string
    ): Promise<ResponseProductDto[]> {
        if (active === 'true') {
            return await this.productService.findAllActive();
        }
        return await this.productService.findAll();
    }

    @Get('search')
    async findByName(@Query('name') name: string): Promise<ResponseProductDto> {
        return await this.productService.findByName(name);
    }

    @Get('brand/:brandId')
    async findByBrand(
        @Param('brandId', ParseIntPipe) brandId: number
    ): Promise<ResponseProductDto[]> {
        return await this.productService.findByBrand(brandId);
    }

    @Get('line/:lineId')
    async findByLine(
        @Param('lineId', ParseIntPipe) lineId: number
    ): Promise<ResponseProductDto[]> {
        return await this.productService.findByLine(lineId);
    }

    @Get('exists/:id')
    async exists(
        @Param('id', ParseIntPipe) id: number
    ): Promise<{ exists: boolean }> {
        const exists = await this.productService.exists(id);
        return { exists };
    }

    @Get('exists-name')
    async existsByName(
        @Query('name') name: string
    ): Promise<{ exists: boolean }> {
        const exists = await this.productService.existsByName(name);
        return { exists };
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseProductDto> {
        return await this.productService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<ResponseProductDto> {
        if (file) {
            const oldProduct = await this.productService.findOne(id);
            if (oldProduct.imageUrl) {
                const oldFilename = oldProduct.imageUrl.split('/').pop();
                if (oldFilename) {
                    this.uploadService.deleteFile(oldFilename);
                }
            }
            updateProductDto.imageUrl = this.uploadService.getImageUrl(file.filename);
        }
        return await this.productService.update(id, updateProductDto);
    }

    @Patch(':id/stock')
    async updateStock(
        @Param('id', ParseIntPipe) id: number,
        @Body('stock', ParseIntPipe) stock: number
    ): Promise<ResponseProductDto> {
        return await this.productService.updateStock(id, stock);
    }

    @Patch(':id/restore')
    async restore(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseProductDto> {
        return await this.productService.restore(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.productService.remove(id);
    }

    @Delete(':id/soft')
    async softDelete(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseProductDto> {
        return await this.productService.softDelete(id);
    }
}
