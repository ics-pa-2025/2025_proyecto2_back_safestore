import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from 'src/common/services/upload.service';
import { MulterConfigService } from 'src/common/config/multer.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]), 
        HttpModule,
        MulterModule.registerAsync({
            useClass: MulterConfigService,
        }),
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository, UploadService, MulterConfigService],
    exports: [ProductService, ProductRepository],
})
export class ProductModule {}
