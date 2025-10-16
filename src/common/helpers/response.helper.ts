/**
 * Helper para generar mensajes de respuesta estándar
 */
export class ResponseHelper {
    /**
     * Genera un mensaje de éxito para operaciones de eliminación
     * @param entityName - Nombre de la entidad
     * @param id - ID de la entidad
     * @returns Objeto con mensaje de éxito
     */
    static deleteSuccess(entityName: string, id: number | string): { message: string } {
        return { 
            message: `${entityName} con ID ${id} eliminada correctamente` 
        };
    }

    /**
     * Genera un mensaje de éxito para operaciones de desactivación
     * @param entityName - Nombre de la entidad
     * @param id - ID de la entidad
     * @returns Objeto con mensaje de éxito
     */
    static deactivateSuccess(entityName: string, id: number | string): { message: string } {
        return { 
            message: `${entityName} con ID ${id} desactivada correctamente` 
        };
    }

    /**
     * Genera un mensaje de éxito para operaciones de creación
     * @param entityName - Nombre de la entidad
     * @returns Objeto con mensaje de éxito
     */
    static createSuccess(entityName: string): { message: string } {
        return { 
            message: `${entityName} creada correctamente` 
        };
    }

    /**
     * Genera un mensaje de éxito para operaciones de actualización
     * @param entityName - Nombre de la entidad
     * @param id - ID de la entidad
     * @returns Objeto con mensaje de éxito
     */
    static updateSuccess(entityName: string, id: number | string): { message: string } {
        return { 
            message: `${entityName} con ID ${id} actualizada correctamente` 
        };
    }
}