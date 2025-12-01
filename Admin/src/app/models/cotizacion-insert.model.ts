export class CotizacionInsert {
    clie_Id: number = 0;
    tiSe_Id: number = 0;
    mone_Id: number = 0;
    coti_DescripcionBien: string = '';
    coti_SumaAsegurada: number = 0;

    constructor(init?: Partial<CotizacionInsert>) {
        Object.assign(this, init);
    }
}
