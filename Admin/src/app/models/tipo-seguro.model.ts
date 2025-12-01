export class TipoSeguro {
    tiSe_Id: number = 0;
    tiSe_Nombre: string = '';
    tiSe_Descripcion: string = '';

    constructor(init?: Partial<TipoSeguro>) {
        Object.assign(this, init);
    }
}
