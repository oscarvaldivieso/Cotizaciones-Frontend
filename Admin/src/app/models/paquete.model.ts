
export class Paquete{
    paqt_Id: number = 0;
    paqt_Nombre: string = '';
    paqt_Descripcion: string = '';
    paqt_PrecioPorPersona: number = 0;
    paqt_CantidadPersonas: number = 0;
    paqt_ImagenPortada: string = '';
    vuel_Id: number = 0;
    vuel_Nombre: string = '';
    habi_Id:number = 0;
    habt_Nombre: string = '';
    rest_Id: number = 0;
    rest_Nombre: string = '';
    usua_Creacion: number = 0;
    paqt_FechaCreacion: Date = new Date();


    paqt_FechaModificacion: Date = new Date();
    usua_Modificacion: number = 0;
    actividades: any[] = []; // Cambia el tipo según tu modelo de servicio
    imagenes: any[] = []; // Cambia el tipo según tu modelo de imagen


    constructor(init?: Partial<Paquete>){
        Object.assign(this,init);
    }
}


