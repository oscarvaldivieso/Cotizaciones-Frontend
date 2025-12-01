export class TipoCliente {
    tiCl_Id: number = 0;
    tiCl_Nombre: string = '';

    constructor(init?: Partial<TipoCliente>) {
        Object.assign(this, init);
    }
}
