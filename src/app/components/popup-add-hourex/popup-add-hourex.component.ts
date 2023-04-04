import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { AuthService } from 'src/app/services/auth.service';
import { HorasExtrasService } from 'src/app/services/horas-extras.service';
import { PopupActionSuccessComponent } from '../popup-action-success/popup-action-success.component';

@Component({
  selector: 'app-popup-add-hourex',
  templateUrl: './popup-add-hourex.component.html',
  styleUrls: ['./popup-add-hourex.component.css']
})
export class PopupAddHourexComponent implements OnInit {
  user: any;
  desde: any;
  hasta: any;

  constructor(
    public dialogRef: MatDialogRef<PopupAddHourexComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private horaExtraService: HorasExtrasService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    const fechaDesde = this.data.cantidad.desde;
    const fechaHasta = this.data.cantidad.hasta;

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
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
    });
  }

  actualizarHoraExtra(){
    var listEmpleados = this.data.empleados;
    listEmpleados.push(this.user.id)
    const HORAEXTRA: HoraExtra = {
      empleados: listEmpleados
    };
    this.horaExtraService.editHoraExtra(this.data.id, HORAEXTRA).then(
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
}
