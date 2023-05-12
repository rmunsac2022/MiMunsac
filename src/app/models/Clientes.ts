export class Cliente {
    id?: string;
    customerIdRelBase?: any;
    cantidadCompras?: number;
    datosPersonales?: {
        correo: string,
        esEmpresa: boolean,
        nombre: string,
        pass: string,
        rut: string,
        telefono: string
    };
    documentos?: any[];
    idFolios?: any[];
}