export class rolPantallas{

    role_Id: number = 0;
    role_Nombre: string = '';
    usua_Creacion: number = 0;
    role_FechaCreacion: Date = new Date();
    pantIds: string = '';

constructor(init?: Partial<rolPantallas>){
        Object.assign(this,init);
    }
}