import { NotFoundException, ConflictException } from '@nestjs/common';

/**
 * Helper para verificaciones de existencia de entidades
 */
export class EntityHelper {
    /**
     * Verifica que una entidad existe, si no lanza NotFoundException
     * @param entity - Entidad a verificar
     * @param entityName - Nombre de la entidad para el mensaje de error
     * @param id - ID de la entidad
     * @throws NotFoundException si la entidad no existe
     */
    static ensureExists<T>(entity: T | null | undefined, entityName: string, id: number | string): T {
        if (!entity) {
            throw new NotFoundException(`No se encontró ${entityName} con ID ${id}`);
        }
        return entity;
    }

    /**
     * Verifica que una entidad no existe (para evitar duplicados), si existe lanza ConflictException
     * @param entity - Entidad a verificar
     * @param entityName - Nombre de la entidad para el mensaje de error
     * @param fieldName - Nombre del campo que se está verificando
     * @param value - Valor del campo
     * @throws ConflictException si la entidad ya existe
     */
    static ensureNotExists<T>(entity: T | null | undefined, entityName: string, fieldName: string, value: string): void {
        if (entity) {
            throw new ConflictException(
                `Ya existe ${entityName} con ${fieldName} "${value}"`
            );
        }
    }
}