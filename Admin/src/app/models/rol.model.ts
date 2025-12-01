export class Rol {

    role_Id: number = 0;
    role_Nombre: string = '';
    // pant_Id: number = 0;
    usua_Creacion: number = 0;
    role_FechaCreacion: Date = new Date();
    pantIds: string = '';

    constructor(init?: Partial<Rol>){
        Object.assign(this,init);
    }
}