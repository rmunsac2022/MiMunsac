import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { PopupTickQrComponent } from 'src/app/components/popup-tick-qr/popup-tick-qr.component';
import { PopupCreateReportComponent } from 'src/app/components/popup-create-report/popup-create-report.component';
import { AuthService } from 'src/app/services/auth.service';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { HorasExtrasService } from 'src/app/services/horas-extras.service';
import { PermissionRequestService } from 'src/app/services/permission-request.service';

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
    private horaExtraService: HorasExtrasService,
    private permissionService: PermissionRequestService
  ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user){
        this.router.navigate(['/login']);
      }
      if (user){
        this.permissionService.confirmPermitions();
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
      this.user = user[0];
      var partesNombre = this.user.nombre.split(" ");
      var primerNombre = partesNombre[0];
      var primerApellido = partesNombre[2];
      this.user.name = primerNombre;
      this.user.apellido = primerApellido;

      var anio = new Date().getFullYear();
      var mes = new Date().getMonth() + 1;
      var fecha = mes+"."+anio
      this.getHoraExtra(fecha);
    });
  }

  getHoraExtra(fecha: string){
    const sub = this.horaExtraService.getHoraExtraByMes(fecha, 'mesAnio').subscribe((horasExtras)=>{
      sub.unsubscribe();
      horasExtras.forEach((element: HoraExtra)=>{
        const fechaHoraDesde = element.cantidad!.desde;
        const fechaHoraHasta = element.cantidad!.hasta;

        const fechaDesde = new Date(fechaHoraDesde);
        const fechaHasta = new Date(fechaHoraHasta);
        const diferenciaMilisegundos = fechaHasta.getTime() - fechaDesde.getTime();
        const diferenciaHoras = Math.round(diferenciaMilisegundos / (1000 * 60 * 60));
        element.duracion = diferenciaHoras
      });
      this.listHorasExtras = horasExtras;
    });
    this.loading = false;
  }

  marcarEntrada() {
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'entrada',
      maxWidth:  "40vw",
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  marcarSalida(){
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'salida',
      maxWidth:  "40vw",
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

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        console.log(latitude+", "+longitude);
      });
    } else {
      console.log("No support for geolocation")
    }
  }
}
