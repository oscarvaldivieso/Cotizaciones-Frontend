export class Habitacion {
    habt_Id: number = 0;
    tipH_Id: number = 0;
    tipH_Descripcion: string = '';
    hote_Id: number = 0;
    htel_Descripcion: string = '';
    habt_PrecioNoche: number = 0;
    usua_Creacion: number = 0;
    habt_FechaCreacion: Date = new Date();


    constructor(init?: Partial<Habitacion>) {
        Object.assign(this, init);
    }
}
