export class Horario {
    id?: string;
    fecha?: Date;
    fechaString?: string;
    hora?: string;
    accion?: string;
    idUsuario?: string;
    horario?: {
        llegada: string;
        salida: string;
    };
}