/**
 * Modelo de Colaborador
 * Representa un colaborador del sistema
 */
export class Colaborador {
    colb_Id?: number;
    colb_Codigo?: string;
    colb_Identidad?: string;
    colb_NombreCompleto?: string;
    colb_Telefono?: string;
    usua_Creacion?: number;
    colb_FechaCreacion?: string;
    usua_Modificacion?: number | null;
    colb_FechaModificacion?: string | null;
    colb_Sexo?: string;
    cosu_DistanciaKm?: number;

    constructor(init?: Partial<Colaborador>) {
        Object.assign(this, init);
    }
}
