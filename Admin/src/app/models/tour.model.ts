export class Tour{
    tour_Id: number = 0;
    acti_Id: number =0;
    acti_Descripcion: string = '';
    tour_Direccion: string = '';
    muni_Codigo: string = '';
    muni_Nombre: string = '';
    usua_Creacion: number = 0;
    tour_FechaCreacion: Date = new Date();


    constructor(init?: Partial<Tour>){
        Object.assign(this,init);
    }
}


