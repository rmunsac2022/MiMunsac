export class Setting {
    id?: string;
    datosTienda?: {
        entrada: string,
        gracia: string,
        salida: string
    };
    notificacionMail?:{
        horario: {
            activo: boolean,
            mailsDestino: string
        }
        reporte:{
            activo: boolean,
            mailsDestino: string
        }
        solicitud:{
            activo: boolean,
            mailsDestino: string
        }
    };
    version?: string;
}