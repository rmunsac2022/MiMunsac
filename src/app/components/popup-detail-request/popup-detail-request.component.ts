import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Requests } from 'src/app/models/Request';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-popup-detail-request',
  templateUrl: './popup-detail-request.component.html',
  styleUrls: ['./popup-detail-request.component.css']
})
export class PopupDetailRequestComponent implements OnInit {
  fecha: string | undefined;
  desde: any;
  hasta: any;
  user: any;
  documentos: string[] = [];
  request: any;
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<PopupDetailRequestComponent>,
    private storage: Storage,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { 
    if(data!=null) {
      this.request = data.request;
      this.user = data.user;
    } 
  }

  ngOnInit(): void {
    var partesNombre = this.user.nombre.split(" ");
    this.user.name = partesNombre[0];
    this.user.apellido = partesNombre[2];

    var partesFecha = this.request.fechaString.split(".");
    var dia = partesFecha[0];
    var mes = partesFecha[1];
    var anio = partesFecha[2];
    this.fecha = dia + "/" + mes + "/" + anio;
    this.desde = this.request.rangoSolicitados.desde.seconds*1000;
    this.hasta = this.request.rangoSolicitados.hasta.seconds*1000;

    this.message = 'La solicitud fue ' + this.request.estado;
  }

  getDocument(urlImagen: any){
    const documentRef = ref(this.storage, 'solicitudes/'.concat(urlImagen));

    listAll(documentRef).then(async documentos => {
      this.documentos = [];
      for(let image of documentos.items) {
        const url = await getDownloadURL(image);
        this.documentos.push(url);
      }
      this.documentos.forEach((element)=> {
        window.open(element, '_blank');
      })   
    }).catch(error => console.log(error));
  }

}
