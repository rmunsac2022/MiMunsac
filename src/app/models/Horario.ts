export class Horario {
    id?: string;
    fecha?: Date;
    fechaString?: string;
    hora?: string;
    accion?: string;
    idUsuario?: string;
    llegada?: string;
    salida?: string;
    idReporteEntrada?: string[];
    idReporteSalida?: string[];
    horario?: {
        llegada: string;
        salida: string;
    };
    dia?: string;
    am?: string;
    pm?: string;
    largeReports?: number
}