import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { AuthService } from 'src/app/services/auth.service';
import { HorasExtrasService } from 'src/app/services/horas-extras.service';
import { PopupActionSuccessComponent } from '../popup-action-success/popup-action-success.component';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-popup-add-hourex',
  templateUrl: './popup-add-hourex.component.html',
  styleUrls: ['./popup-add-hourex.component.css']
})
export class PopupAddHourexComponent implements OnInit {
  user: any;
  desde: any;
  hasta: any;
  documentos: string[] = [];
  listNombres: string[] = [];
  nombre: string = '';
  horaExtra: any;
  detail: boolean | undefined;

  constructor(
    public dialogRef: MatDialogRef<PopupAddHourexComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private horaExtraService: HorasExtrasService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private dialog: MatDialog,
    private storage: Storage,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.horaExtra = this.data.horaExtra;
    this.detail = this.data.detail;
    const fechaDesde = this.horaExtra.cantidad.desde;
    const fechaHasta = this.horaExtra.cantidad.hasta;

    const fecha1 = new Date(fechaDesde);
    const anio1 = fecha1.getFullYear();
    const mes1 = fecha1.getMonth() + 1;
    const dia1 = fecha1.getDate();
    const hora1 = fecha1.getHours();

    const fecha2 = new Date(fechaHasta);
    const anio2 = fecha2.getFullYear();
    const mes2 = fecha2.getMonth() + 1;
    const dia2 = fecha2.getDate();
    const hora2 = fecha2.getHours();

    if(hora1 > 11){
      var horario1 = 'PM';
    }else{
      var horario1 = 'AM';
    }
    if(hora2 > 11){
      var horario2 = 'PM';
    }else{
      var horario2 = 'AM';
    }
    this.desde = dia1+"/"+mes1+"/"+anio1+" "+hora1+horario1
    this.hasta = dia2+"/"+mes2+"/"+anio2+" "+hora2+horario2

    this.afAuth.onAuthStateChanged((user) => {
      this.getUser(user!.email)
    });

    this.getEmpleados(this.horaExtra.empleados);
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
    });
  }

  getEmpleados(empleados: any){
    empleados.forEach((element: any)=>{
      const sub = this._authService.getUserById(element).subscribe((user)=>{
        sub.unsubscribe();
        var nombre = user.nombre;   
        
        var partesNombre = nombre.split(" ");
        var primerNombre = partesNombre[0];
        var primerApellido = partesNombre[2];
  
        this.nombre = primerNombre+' '+primerApellido;
        this.listNombres.push(this.nombre);
      });
    });
  }

  actualizarHoraExtra(){
    var listEmpleados = this.horaExtra.empleados;
    listEmpleados.push(this.user.id)
    const HORAEXTRA: HoraExtra = {
      empleados: listEmpleados
    };
    this.horaExtraService.editHoraExtra(this.horaExtra.id, HORAEXTRA).then(
      () => {
        const dialogRef = this.dialog.open(PopupActionSuccessComponent, {
          data: 'HORA EXTRA'
        });
        this.dialogRef.close();
        dialogRef.afterClosed().subscribe(result => {
    
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getDocument(urlImagen: any){
    const documentRef = ref(this.storage, 'horasExtras/'.concat(urlImagen));

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
