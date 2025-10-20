import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from './supplier.repository';
import { Supplier } from './entities/supplier.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([Supplier]), HttpModule],
    controllers: [SupplierController],
    providers: [SupplierService, SupplierRepository],
    exports: [SupplierService, SupplierRepository],
})
export class SupplierModule {}
