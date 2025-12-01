export class Hotel{
    htel_Id: number = 0;
    htel_Nombre: string = '';
    htel_Descripcion: string = '';
    htel_NumeroHabitaciones: number = 0;
    htel_Telefono: string = '';
    htel_CantidadEstrellas:  number = 0;
    htel_Direccion: string = '';
    muni_Codigo: string = '';
    muni_Nombre: string = '';
    depa_Nombre: string = '';
    hote_ImagenPortada: string = '';
    usua_Creacion: number = 0;
    htel_FechaCreacion: Date = new Date();
    usua_Modificacion: number = 0;
    htel_FechaModificacion: Date = new Date();

    servicios: any[] = []; // Cambia el tipo según tu modelo de servicio
    imagenes: any[] = []; // Cambia el tipo según tu modelo de imagen


    constructor(init?: Partial<Hotel>){
        Object.assign(this,init);
    }
}


