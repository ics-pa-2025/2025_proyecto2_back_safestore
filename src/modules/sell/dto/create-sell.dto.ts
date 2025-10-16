import { IsOptional, IsString } from 'class-validator';

export class CreateSellDto {
    @IsString()
    total: string;

    @IsString()
    idVendedor: string;

    @IsString()
    @IsOptional()
    idComprador?: string;
}
