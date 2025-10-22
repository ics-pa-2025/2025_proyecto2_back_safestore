import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    IsInt,
    IsPositive,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateLineDto {
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

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @Type(() => Number)
    @IsInt({ message: 'El ID de la marca debe ser un número entero' })
    @IsPositive({ message: 'El ID de la marca debe ser un número positivo' })
    @IsNotEmpty({ message: 'El ID de la marca es obligatorio' })
    brandId: number;
}
