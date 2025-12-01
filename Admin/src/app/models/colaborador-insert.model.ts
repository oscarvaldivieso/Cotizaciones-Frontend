/**
 * Modelo para insertar un nuevo colaborador
 */
export class ColaboradorInsert {
    colb_Codigo?: string;
    colb_Identidad?: string;
    colb_NombreCompleto?: string;
    colb_Telefono?: string;
    usua_Creacion?: number;
    colb_Sexo?: string;
    sucursales?: ColaboradorSucursalInsert[];

    constructor(init?: Partial<ColaboradorInsert>) {
        Object.assign(this, init);
    }
}

/**
 * Modelo para asignar sucursal a colaborador con distancia
 */
export class ColaboradorSucursalInsert {
    sucu_Id?: number;
    coSu_DistanciaKm?: number;

    constructor(init?: Partial<ColaboradorSucursalInsert>) {
        Object.assign(this, init);
    }
}
