/**
 * Helper específico para el módulo brands con constantes y utilidades
 */
export class BrandsHelper {
    /**
     * Mensajes de error específicos del módulo brands
     */
    static readonly ERROR_MESSAGES = {
        BRAND_NOT_FOUND: (id: number) => `No se encontró la marca con ID ${id}`,
        BRAND_NAME_EXISTS: (name: string) => `Ya existe una marca con el nombre "${name}"`,
        BRAND_NAME_EXISTS_OTHER: (name: string) => `Ya existe otra marca con el nombre "${name}"`,
        DELETE_FAILED: 'No se pudo eliminar la marca',
        DEACTIVATE_FAILED: 'No se pudo desactivar la marca',
    };

    /**
     * Mensajes de éxito específicos del módulo brands
     */
    static readonly SUCCESS_MESSAGES = {
        BRAND_DELETED: (id: number) => `Marca con ID ${id} eliminada correctamente`,
        BRAND_DEACTIVATED: (id: number) => `Marca con ID ${id} desactivada correctamente`,
    };

    /**
     * Constantes de validación específicas del módulo brands
     */
    static readonly VALIDATION = {
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 100,
    };
}