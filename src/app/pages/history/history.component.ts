import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupTickQrComponent } from 'src/app/components/popup-tick-qr/popup-tick-qr.component';
import { Horario } from 'src/app/models/Horario';
import { AuthService } from 'src/app/services/auth.service';
import { HorariosService } from 'src/app/services/horarios.service';
import { PermissionRequestService } from 'src/app/services/permission-request.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ReportsService } from 'src/app/services/reports.service';
import { Report } from 'src/app/models/Report';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';
import { DatePipe } from '@angular/common';

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
  anios: string[] = ['2023', '2024', '2025', '2026', '2027', '2028'];
  mesSelected: any;
  anioSelected: any;
  fecha: string | undefined;
  mes: any;
  selectAnio: any;
  selectMes: any;
  user: any;
  listVacia: boolean = false;
  loading: boolean = true;
  listHorario: Horario[] = [];
  listFiltrada: Horario[] = [];
  isMobile : boolean;
  listReport: Report[] = [];
  viewReports: boolean = false;
  documentos: string[] = [];
  horaFormateada: any;
  horaBD: any;

  constructor(
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    private permissionService: PermissionRequestService,
    private authService: AuthService,
    private toastr: ToastrService,
    private horaExtraService: HorariosService,
    private deviceService: DeviceDetectorService,
    private reportService: ReportsService,
    private storage: Storage,
    private datePipe: DatePipe
  ) { 
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
      if (user){
        this.permissionService.confirmPermitions();
      }
      this.getUser(user!.email)
    });
    this.mes = new Date().getMonth();
    this.selectAnio = new Date().getFullYear();
    this.selectMes = this.meses[this.mes];
  }

  marcarEntrada() {
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'entrada',
      maxWidth:  this.isMobile ? '90dvw' : '40vw',
      minWidth: this.isMobile ? '90dvw' : 'auto',
      maxHeight: this.isMobile ? '70dvh' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  marcarSalida(){
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'salida',
      maxWidth:  this.isMobile ? '90dvw' : '40vw',
      minWidth: this.isMobile ? '90dvw' : 'auto',
      maxHeight: this.isMobile ? '70dvh' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
      this.getHorarioByUser(this.user.id);
    });
  }
  
  getHorarioByUser(id: string){
    const sub = this.horaExtraService.getHorarioByIdUser(id, 'idUsuario').subscribe((doc)=>{
      sub.unsubscribe();
      this.listHorario = [];
      doc.forEach((element: any) => { 
        var partesFecha = element.fechaString.split(".");
        var dia = partesFecha[0];
        var horario = {
          fecha: element.fecha,
          fechaString: element.fechaString,
          llegada: element.horario.llegada,
          salida: element.horario.salida,
          idUsuario: element.idUsuario,
          idReporteEntrada: element.idReporteEntrada,
          idReporteSalida: element.idReporteSalida,
          dia: dia,
          am: '',
          pm: '',
          largeReportsEntrada: 0,
          largeReportsSalida: 0,
        }
        horario.largeReportsEntrada = horario.idReporteEntrada.length;
        horario.largeReportsSalida = horario.idReporteSalida.length;

        var horaLlegada = horario.llegada.split(":");
        var horaSalida = horario.salida.split(":");
        var hora1 = horaLlegada[0];
        hora1 = parseInt(hora1)
        var hora2 = horaSalida[0];
        hora2 = parseInt(hora2)

        if(hora1 <= 11){
          horario.am = 'AM'
        }else{
          horario.am = 'PM'
        }
        if(hora2 <= 11){
          horario.pm = 'AM'
        }else{
          horario.pm = 'PM'
        }

        if(horario.llegada === ""){
          horario.llegada = "Unmarked";
          horario.am = "";
        }
        if(horario.salida === ""){
          horario.salida = "Unmarked";
          horario.pm = "";
        }

        this.listHorario.push(horario);  
      });
      if(this.listHorario.length<=0){
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

    this.listHorario.forEach((element)=>{
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
      //this.toastr.info('No se encontró historial')
    }else{
      //this.toastr.success('Historial encontrado')
    }
    this.loading = false;
  }

  getReportById(listId: any, index: any){
    this.listHorario.forEach((element: any)=>{
      element.reportes = []
    });
    this.viewReports = true;
    listId.forEach((element: any)=>{
      const sub = this.reportService.getReportByid(element).subscribe((report)=>{
        sub.unsubscribe();
        var hora = report.fecha.seconds;          
        const fechaHora = new Date();
        fechaHora.setTime(hora * 1000);
        this.horaFormateada = this.datePipe.transform(fechaHora, 'HH:mm');   
        this.horaBD = this.datePipe.transform(fechaHora, 'HH');   
        report.hora = this.horaFormateada;   
        if(this.horaBD <= 11){
          report.horario = 'AM'
        }else{
          report.horario = 'PM'
        }
        this.listHorario[index].reportes?.push(report);
      })
    })
  }

  getDocument(urlImagen: any){
    const documentRef = ref(this.storage, 'reportes/'.concat(urlImagen));

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
