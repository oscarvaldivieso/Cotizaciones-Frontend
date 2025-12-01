export class Empleado{
    empl_Id: number = 0;
    empl_Identidad: string ='';
    empl_Nombres: string = '';
    empl_Apellidos: string = '';
    carg_Id: number = 0;
    carg_Descripcion: string ='';
    empl_FechaNacimiento: Date = new Date();
    empl_Sexo: string = '';
    esCi_Id:  number = 0;
    esCi_Nombre: string = '';
    empl_Direccion: string = '';
    muni_Codigo: string = '';
    muni_Nombre: string = '';
    empl_Telefono: string = '';
    empl_Imagen: string = '';
    usua_Creacion: number = 0;
    empl_FechaCreacion: Date = new Date();


    constructor(init?: Partial<Empleado>){
        Object.assign(this,init);
    }
}


