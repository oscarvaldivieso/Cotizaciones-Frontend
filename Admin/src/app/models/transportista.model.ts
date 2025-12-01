/**
 * Modelo de Transportista
 * Representa un transportista del sistema
 */
export class Transportista {
    tran_Id?: number;
    tran_Identidad?: string;
    tran_NombreCompleto?: string;
    tran_Telefono?: string;
    tran_TarifaPorKm?: number;
    usua_Creacion?: number;
    colb_FechaCreacion?: string;
    usua_Modificacion?: number | null;
    colb_FechaModificacion?: string | null;

    constructor(init?: Partial<Transportista>) {
        Object.assign(this, init);
    }
}
