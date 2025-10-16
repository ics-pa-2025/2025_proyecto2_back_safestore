import { plainToClass, ClassConstructor } from 'class-transformer';

/**
 * Helper para transformaciones de DTOs comunes
 */
export class TransformHelper {
    /**
     * Transforma un objeto a DTO usando class-transformer
     * @param dto - Clase DTO de destino
     * @param data - Datos a transformar
     * @returns Objeto transformado
     */
    static toDto<T, V>(dto: ClassConstructor<T>, data: V): T {
        return plainToClass(dto, data, {
            excludeExtraneousValues: true,
        });
    }

    /**
     * Transforma un array de objetos a DTOs usando class-transformer
     * @param dto - Clase DTO de destino
     * @param data - Array de datos a transformar
     * @returns Array de objetos transformados
     */
    static toDtoArray<T, V>(dto: ClassConstructor<T>, data: V[]): T[] {
        return data.map(item => this.toDto(dto, item));
    }
}