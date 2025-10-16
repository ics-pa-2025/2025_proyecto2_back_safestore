import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { typeOrmAsyncConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from './modules/brands/brands.module';
import { ProductModule } from './modules/product/product.module';
import { LineModule } from './modules/line/line.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { SellModule } from './modules/sell/sell.module';
import { SellDetailModule } from './modules/sell-detail/sell-detail.module';


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
        SellModule,
        SellDetailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
