export class Restaurante{
    rest_Id: number = 0;
    rest_Nombre: string = '';
    rest_Descripcion: string = '';
    rest_Direccion: string = '';
    muni_Codigo: string = '';
    muni_Nombre: string = '';
    depa_Codigo: string = '';
    depa_Nombre: string = '';
    tRes_Id: number = 0;
    rest_ImagenPortada: string = '';
    tRes_Descripcion: string = '';
    rest_Telefono: string = '';
    rest_tieneWifi: boolean = false;
    rest_esPetFriendly: boolean = false;
    rest_CantidadEstrellas: number = 0;
    rest_RangoPrecios: number = 0;
    usua_Creacion: number = 0;
    rest_FechaCreacion: Date = new Date();
    rest_FechaModificacion: Date = new Date();
    usua_Modificacion: number = 0;
    servicios: any[] = []; // Cambia el tipo según tu modelo de servicio
    imagenes: any[] = []; // Cambia el tipo según tu modelo de imagen


    constructor(init?: Partial<Restaurante>){
        Object.assign(this,init);
    }
}


