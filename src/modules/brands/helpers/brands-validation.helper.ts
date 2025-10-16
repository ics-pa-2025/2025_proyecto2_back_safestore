import { ConflictException, BadRequestException } from '@nestjs/common';
import { BrandsRepository } from '../brands.repository';

/**
 * Helper específico para validaciones del módulo brands
 */
export class BrandsValidationHelper {
    /**
     * Valida que no exista otra marca con el mismo nombre al actualizar
     * @param repository - Repositorio de brands
     * @param name - Nombre a validar (puede ser undefined)
     * @param currentId - ID actual de la marca (para excluir en la validación)
     * @param currentName - Nombre actual de la marca
     * @throws ConflictException si existe otra marca con el mismo nombre
     */
    static async validateUniqueNameOnUpdate(
        repository: BrandsRepository,
        name: string | undefined,
        currentId: number,
        currentName: string
    ): Promise<void> {
        if (name && name !== currentName) {
            const nameExists = await repository.nameExists(name, currentId);
            if (nameExists) {
                throw new ConflictException(
                    `Ya existe otra marca con el nombre "${name}"`
                );
            }
        }
    }

    /**
     * Valida que no exista una marca con el nombre especificado
     * @param repository - Repositorio de brands
     * @param name - Nombre a validar
     * @throws ConflictException si ya existe una marca con ese nombre
     */
    static async validateUniqueNameOnCreate(
        repository: BrandsRepository,
        name: string
    ): Promise<void> {
        const existingBrand = await repository.findByName(name);
        if (existingBrand) {
            throw new ConflictException(
                `Ya existe una marca con el nombre "${name}"`
            );
        }
    }

    /**
     * Valida que la operación de eliminación/desactivación sea exitosa
     * @param result - Resultado de la operación
     * @param operation - Tipo de operación ('eliminar' o 'desactivar')
     * @throws BadRequestException si la operación falló
     */
    static validateOperationResult(result: boolean, operation: string): void {
        if (!result) {
            throw new BadRequestException(`No se pudo ${operation} la marca`);
        }
    }
}