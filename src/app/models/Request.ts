export class Requests {
    id?: string;
    categoria?: string;
    descripcion?: string;
    estado?: string;
    fecha?: Date;
    idUsuario?: string;
    leido?: boolean;
    rangoSolicitados?: {
        desde: Date,
        hasta: Date
    };
    urlDocumento?: string;
    fechaString?: string;
    mesAnio?: string;
    nombre?: string;
    hora?: string;
    horario?: string;
    emoji?: string;
    name?: string;
    apellido?: string;
    correo?: string;
    telefono?: string;
    rut?: string;
    motivoRechazo?: string;
}