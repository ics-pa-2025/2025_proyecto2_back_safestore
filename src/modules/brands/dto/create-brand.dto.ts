import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    @Transform(({ value }) => value?.trim())
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(500, {
        message: 'La descripción no puede exceder 500 caracteres',
    })
    @Transform(({ value }) => value?.trim())
    description?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255, {
        message: 'La URL del logo no puede exceder 255 caracteres',
    })
    logo?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
