import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { LineRepository } from './line.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Line } from './entities/line.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([Line]), HttpModule],
    controllers: [LineController],
    providers: [LineService, LineRepository],
    exports: [LineService, LineRepository],
})
export class LineModule {}
