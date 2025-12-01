export class Moneda {
    mone_Id: number = 0;
    mone_Codigo: string = '';
    mone_Nombre: string = '';
    mone_Simbolo: string = '';

    constructor(init?: Partial<Moneda>) {
        Object.assign(this, init);
    }
}
