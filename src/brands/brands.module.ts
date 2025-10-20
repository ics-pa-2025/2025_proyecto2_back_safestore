import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { BrandsRepository } from './brands.repository';
import { Brand } from './entities/brand.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([Brand]), HttpModule],
    controllers: [BrandsController],
    providers: [BrandsService, BrandsRepository],
    exports: [BrandsService, BrandsRepository],
})
export class BrandsModule {}
