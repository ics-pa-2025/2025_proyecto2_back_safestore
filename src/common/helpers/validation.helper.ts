import { BadRequestException } from '@nestjs/common';

/**
 * Helper para validaciones comunes que pueden ser reutilizadas en múltiples módulos
 */
export class ValidationHelper {
    /**
     * Valida que el ID sea un número positivo
     * @param id - ID a validar
     * @param fieldName - Nombre del campo para el mensaje de error (opcional)
     * @throws BadRequestException si el ID no es válido
     */
    static validatePositiveId(id: number, fieldName: string = 'ID'): void {
        if (!id || id <= 0) {
            throw new BadRequestException(`El ${fieldName} debe ser un número positivo`);
        }
    }

    /**
     * Valida que una cadena no esté vacía
     * @param value - Valor a validar
     * @param fieldName - Nombre del campo para el mensaje de error
     * @throws BadRequestException si el valor está vacío
     */
    static validateNonEmpty(value: string, fieldName: string): void {
        if (!value || value.trim().length === 0) {
            throw new BadRequestException(`El ${fieldName} no puede estar vacío`);
        }
    }

    /**
     * Valida que una cadena tenga una longitud mínima
     * @param value - Valor a validar
     * @param minLength - Longitud mínima
     * @param fieldName - Nombre del campo para el mensaje de error
     * @throws BadRequestException si el valor es muy corto
     */
    static validateMinLength(value: string, minLength: number, fieldName: string): void {
        if (!value || value.trim().length < minLength) {
            throw new BadRequestException(
                `El ${fieldName} debe tener al menos ${minLength} caracteres`
            );
        }
    }

    /**
     * Valida que una cadena tenga una longitud máxima
     * @param value - Valor a validar
     * @param maxLength - Longitud máxima
     * @param fieldName - Nombre del campo para el mensaje de error
     * @throws BadRequestException si el valor es muy largo
     */
    static validateMaxLength(value: string, maxLength: number, fieldName: string): void {
        if (value && value.trim().length > maxLength) {
            throw new BadRequestException(
                `El ${fieldName} no puede tener más de ${maxLength} caracteres`
            );
        }
    }
}