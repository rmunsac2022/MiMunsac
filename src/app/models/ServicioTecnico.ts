export class ServicioTecnico {
    id?: string;
    datosCliente: any;
    datosProducto: any;
    documento: any;
    horaString: any;
    revisiones?: {
        quiebre?: string;
        rayones?: string;
        neumaticoPinchado?: string;
        neumaticoEstable?: string;
        luzQuemada?: string;
        bocinaFuncional?: string;
        amortiguacionQuebrada?: string;
        displayQuemado?: string;
        motorFuncional?: string;
        cableadoCortado?: string;
        manillaresFrenos?: string;
        isFactura?: boolean;
    };
    estado?: string;
    diagnostico?: string;
    fecha: any;
    fechaString?: string;
    comentario?: string;
}