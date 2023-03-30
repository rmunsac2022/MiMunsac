import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { PopupTickQrComponent } from 'src/app/components/popup-tick-qr/popup-tick-qr.component';
import { PopupCreateReportComponent } from 'src/app/components/popup-create-report/popup-create-report.component';
import { AuthService } from 'src/app/services/auth.service';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { HorasExtrasService } from 'src/app/services/horas-extras.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  fecha: any;
  meses: string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  loading: boolean = true;
  today: any;
  mes: number | undefined;
  dia: number | undefined;
  anio: number | undefined;
  email: any;
  user: any;
  listHorasExtras: HoraExtra[] = [];
  
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private authService: AuthService,
    private horaExtraService: HorasExtrasService
  ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
      this.getUser(user!.email)
    });

    this.mes = new Date().getMonth();
    this.dia = new Date().getDate();
    this.anio = new Date().getFullYear();
    this.fecha = (this.dia + " de " + this.meses[this.mes] + " del " + this.anio);
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmail(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      console.log(user);
      this.user = user[0];
      var partesNombre = this.user.nombre.split(" ");
      var primerNombre = partesNombre[0];
      var primerApellido = partesNombre[2];
      this.user.name = primerNombre;
      this.user.apellido = primerApellido;
      this.loading = false;
    });
  }

  /*getHoraExtra(){
    const sub = this.horaExtraService.getHoraExtraByMes().subscribe((horasExtras)=>{

    })
    //this.loading = false;
  }*/

  marcarEntrada() {
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'asd'
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  marcarSalida(){
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'asd'
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  crearReporte(){
    const dialogRef = this.dialog.open(PopupCreateReportComponent, {
      data: 'asd'
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
