
export class Vuelo{
    vuel_Id: number = 0;
    vuel_Nombre: string = '';
    vuel_Descripcion: string = '';
    vuel_FechaPartida: Date = new Date();
    vuel_FechaLlegada: Date = new Date();
    aerp_Salida_Id: number = 0;
    aerpSalida_Nombre: string = '';
    aerp_Llegada_Id: number = 0;
    aerpLlegada_Nombre: string = '';
    aerl_Id: number = 0;
    aerl_Nombre: string = '';
    avio_Id: number = 0;
    avio_Modelo: string = '';
    vuel_Imagen: string = '';
    vuel_Precio: number = 0;
    usua_Creacion: number = 0;
    vuel_FechaCreacion: Date = new Date();
    vuel_FechaModificacion: Date = new Date();
    usua_Modificacion: number = 0;

    servicios: any[] = []; // Cambia el tipo según tu modelo de servicio
    imagenes: any[] = []; // Cambia el tipo según tu modelo de imagen


    constructor(init?: Partial<Vuelo>){
        Object.assign(this,init);
    }
}


