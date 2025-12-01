/**
 * Interface para colaboradores que participan en un viaje
 */
export interface ColaboradorViaje {
    colb_Id: number;
    clVj_DistanciaKm: number;
}

/**
 * Modelo de Viaje
 * Representa un viaje registrado en el sistema
 */
export class Viaje {
    viaj_Id?: number;
    viaj_Fecha?: string;
    sucu_Id?: number;
    tran_Id?: number;
    usua_Creacion?: number;
    usua_Modificacion?: number;
    viaj_FechaCreacion?: string;
    colaboradores?: ColaboradorViaje[];

    constructor(init?: Partial<Viaje>) {
        Object.assign(this, init);
    }
}
