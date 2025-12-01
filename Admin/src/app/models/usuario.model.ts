export class Usuario{
    usua_Id: number = 0;
    usua_Nombre: string ='';
    usua_Contrasena: string = '';
    usua_Imagen: string = '';
    empl_Id: number = 0;
    nombreCompleto: string ='';
    // carg_Id: number = 0;
    role_Id: number = 0;
    role_Nombre: string ='';
    usua_Estado: number = 0;
    usua_Creacion: number = 0;
    usua_FechaCreacion: Date = new Date();

    constructor(init?: Partial<Usuario>){
        Object.assign(this,init);
    }
}

