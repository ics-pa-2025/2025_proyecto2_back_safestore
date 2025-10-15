import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BrandsModule } from './brands/brands.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/database.config';
import { ProductModule } from './product/product.module';
import { LineModule } from './line/line.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        HttpModule,
        BrandsModule,
        ProductModule,
        LineModule,
        SupplierModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
