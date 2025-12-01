export class Cliente{
    clie_Id: number = 0;
    clie_Identidad: string ='';
    clie_Nombres: string = '';
    clie_Apellidos: string = '';
    clie_FechaNacimiento: Date = new Date();
    clie_Sexo: string = '';
    esCi_Id:  number = 0;
    esCi_Nombre:  string = '';
    clie_Direccion: string = '';
    muni_Codigo: string = '';
    muni_Nombre: string = '';
    clie_Imagen: string = '';
    clie_Telefono: string = '';
    usua_Creacion: number = 0;
    clie_FechaCreacion: Date = new Date();


    constructor(init?: Partial<Cliente>){
        Object.assign(this,init);
    }
}


