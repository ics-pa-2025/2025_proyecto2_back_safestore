import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { LineRepository } from './line.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Line } from './entities/line.entity';
import { HttpModule } from '@nestjs/axios';
import { BrandsModule } from '../brands/brands.module';

@Module({
    imports: [TypeOrmModule.forFeature([Line]), HttpModule, BrandsModule],
    controllers: [LineController],
    providers: [LineService, LineRepository],
    exports: [LineService, LineRepository],
})
export class LineModule {}
