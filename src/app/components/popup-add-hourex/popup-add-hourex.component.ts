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
          data: ''
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
