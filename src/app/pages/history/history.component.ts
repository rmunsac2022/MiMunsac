import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupTickQrComponent } from 'src/app/components/popup-tick-qr/popup-tick-qr.component';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { AuthService } from 'src/app/services/auth.service';
import { HorariosService } from 'src/app/services/horarios.service';
import { PermissionRequestService } from 'src/app/services/permission-request.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  meses: any[] = [
    {
      valor:"1",
      nombre:"Enero"
    },{
      valor:"2",
      nombre:"Febrero"
    },{
      valor:"3",
      nombre:"Marzo"
    },{
      valor:"4",
      nombre:"Abril"
    },{
      valor:"5",
      nombre:"Mayo"
    },{
      valor:"6",
      nombre:"Junio"
    },{
      valor:"7",
      nombre:"Julio"
    },{
      valor:"8",
      nombre:"Agosto"
    },{
      valor:"9",
      nombre:"Septiembre"
    },{
      valor:"10",
      nombre:"Octubre"
    },{
      valor:"11",
      nombre:"Noviembre"
    },{
      valor:"12",
      nombre:"Diciembre"
    }
  ];
  isLlegada : boolean = true;
  anios: string[] = ['2023', '2024', '2025', '2026', '2027', '2028'];
  mesSelected: any;
  anioSelected: any;
  hora: any;
  fecha: string | undefined;
  mes: any;
  selectAnio: any;
  selectMes: any;
  user: any;
  listVacia: boolean = false;
  loading: boolean = true;
  listHoraExtra: HoraExtra[] = [];
  listFiltrada: HoraExtra[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    private permissionService: PermissionRequestService,
    private authService: AuthService,
    private toastr: ToastrService,
    private horaExtraService: HorariosService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
      if (user){
        this.permissionService.confirmPermitionsReport();
      }
      this.getUser(user!.email)
    });
    this.mes = new Date().getMonth();
    this.selectAnio = new Date().getFullYear();
    this.selectMes = this.meses[this.mes];
  }

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

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
      this.getReportsByUser(this.user.id);
    });
  }
  
  getReportsByUser(id: string){
    this.horaExtraService.getHorarioByIdUser(id, 'idUsuario').subscribe((doc)=>{
      this.listHoraExtra = [];
      doc.forEach((element: any) => { 
        var reporte = {
          nombre: '',
          fecha: element.fecha,
          descripcion: element.descripcion,
          hora: '',
          horario: '',
          fechaString: element.fechaString,
        }
        var hora = reporte.fecha.seconds;          
        const fechaHora = new Date();
        fechaHora.setTime(hora * 1000);
        this.hora = this.datePipe.transform(fechaHora, 'HH');   
        reporte.hora = this.hora; 
        
        if(this.hora <= 11){
          reporte.horario = 'AM'
        }else{
          reporte.horario = 'PM'
        }
        this.listHoraExtra.push(reporte);  
      });
      if(this.listHoraExtra.length<=0){
        this.listVacia = true;
      }
      this.filtrar();
    });
  }

  filtrar(){ 
    this.listVacia = false;
    this.listFiltrada = [];
    this.anioSelected = (<HTMLInputElement>document.getElementById('anioSelected')).value;
    this.mesSelected = (<HTMLInputElement>document.getElementById('mesSelected')).value;
    this.fecha = this.mesSelected+"."+this.anioSelected;

    this.listHoraExtra.forEach((element)=>{
      var partesFecha = element.fechaString!.split(".");

      var mes = partesFecha[1];
      var anio = partesFecha[2];
      var fechaBD = mes + "." + anio;

      if(this.fecha == fechaBD){
        this.listFiltrada.push(element);        
      }
    });
    if(this.listFiltrada.length<=0){
      this.listVacia = true;
      this.toastr.info('No se encontraron reportes')
    }else{
      this.toastr.success('Reportes encontrados')
    }
    this.loading = false;
  }

}
