export class Cliente {
    clie_Id: number = 0;
    tiCl_Id: number = 0;
    tipoCliente: string = '';
    clie_Nombre: string = '';
    clie_Identidad: string = '';
    clie_FechaNacimiento: Date = new Date();
    clie_Telefono: string = '';
    clie_CorreoElectronico: string = '';
    clie_Activo: boolean = true;
    clie_FechaCreacion: Date = new Date();

    constructor(init?: Partial<Cliente>) {
        Object.assign(this, init);
    }
}


