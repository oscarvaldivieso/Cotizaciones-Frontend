export class Cotizacion {
    coti_Id: number = 0;
    coti_Numero: string = '';
    coti_Fecha: Date = new Date();
    coti_DescripcionBien: string = '';
    coti_SumaAsegurada: number = 0;
    coti_TasaPorcentaje: number = 0;
    coti_PrimaNeta: number = 0;
    coti_CorreoEnviado: boolean = false;
    coti_FechaEnvioCorreo: Date | null = null;

    // Cliente
    clie_Id: number = 0;
    clie_Nombre: string = '';
    clie_Identidad: string = '';
    clie_Telefono: string = '';
    clie_CorreoElectronico: string = '';

    // Tipo Cliente
    tiCl_Id: number = 0;
    tipoCliente: string = '';

    // Tipo Seguro
    tiSe_Id: number = 0;
    tipoSeguro: string = '';
    descripcionSeguro: string = '';

    // Moneda
    mone_Id: number = 0;
    mone_Codigo: string = '';
    moneda: string = '';
    mone_Simbolo: string = '';

    // Campos formateados
    fechaFormateada: string = '';
    sumaAseguradaFormateada: string = '';
    tasaFormateada: string = '';
    primaNetaFormateada: string = '';
    correoEnviadoTexto: string = '';

    constructor(init?: Partial<Cotizacion>) {
        Object.assign(this, init);
    }
}
