import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
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

    @IsNotEmpty({ message: 'El precio es obligatorio' })
    @IsNumber({}, { message: 'El precio debe ser un número' })
    @IsPositive({ message: 'El precio debe ser positivo' })
    @Type(() => Number)
    price: number;

    @IsNotEmpty({ message: 'El stock es obligatorio' })
    @IsInt({ message: 'El stock debe ser un número entero' })
    @Min(0, { message: 'El stock no puede ser negativo' })
    @Type(() => Number)
    stock: number;

    @IsNotEmpty({ message: 'El id de la marca es obligatorio' })
    @IsInt({ message: 'El id de la marca debe ser un número entero' })
    @IsPositive({ message: 'El id de la marca debe ser positivo' })
    @Type(() => Number)
    brandId: number;

    @IsNotEmpty({ message: 'El id de la línea es obligatorio' })
    @IsInt({ message: 'El id de la línea debe ser un número entero' })
    @IsPositive({ message: 'El id de la línea debe ser positivo' })
    @Type(() => Number)
    lineId: number;
}
