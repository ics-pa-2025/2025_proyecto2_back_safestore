import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), HttpModule],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
    exports: [ProductService, ProductRepository],
})
export class ProductModule {}
