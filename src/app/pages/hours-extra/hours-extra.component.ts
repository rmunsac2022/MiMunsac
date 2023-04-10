import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupTickQrComponent } from 'src/app/components/popup-tick-qr/popup-tick-qr.component';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { AuthService } from 'src/app/services/auth.service';
import { HorasExtrasService } from 'src/app/services/horas-extras.service';
import { PermissionRequestService } from 'src/app/services/permission-request.service';
import * as XLSX from 'xlsx';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupAddHourexComponent } from 'src/app/components/popup-add-hourex/popup-add-hourex.component';


@Component({
  selector: 'app-hours-extra',
  templateUrl: './hours-extra.component.html',
  styleUrls: ['./hours-extra.component.css']
})
export class HoursExtraComponent implements OnInit {
  user: any;
  isMobile : boolean;
  listHoraExtra: HoraExtra[] = [];
  listFiltrada: HoraExtra[] = [];
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
  listVacia: boolean = false;
  loading: boolean = true;
  mesSelected: any;
  anioSelected: any;
  fecha: string | undefined;
  selectAnio: any;
  selectMes: any;
  mes: any;
  hora: any;

  constructor(
    private dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private router: Router,
    private permissionService: PermissionRequestService,
    private authService: AuthService,
    private horaExtraService: HorasExtrasService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private deviceService: DeviceDetectorService
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

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
      this.getReportsByUser(this.user.id);
    });
  }
  
  getReportsByUser(id: string){
    this.horaExtraService.getHoraExtraByIdUser(id).subscribe((doc)=>{
      this.listHoraExtra = [];
      doc.forEach((element: any) => { 
        var horaExtra = {
          nombreProyecto: element.nombreProyecto,
          fecha: element.fecha,
          descripcion: element.descripcion,
          hora: '',
          horario: '',
          empleados: element.empleados,
          cantParticipantes: element.empleados.length,
          emoji: element.emoji,
          fechaString: element.fechaString,
          modalidad: element.modalidad,
          valor: element.valor
        }
        var hora = horaExtra.fecha.seconds;          
        const fechaHora = new Date();
        fechaHora.setTime(hora * 1000);
        this.hora = this.datePipe.transform(fechaHora, 'HH');   
        horaExtra.hora = this.hora; 
        
        if(this.hora <= 11){
          horaExtra.horario = 'AM'
        }else{
          horaExtra.horario = 'PM'
        }
        this.listHoraExtra.push(element);  
      });
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
      //this.toastr.info('No se encontraron horas extras')
    }else{
      //this.toastr.success('Horas extras encontrados')
    }
    this.loading = false;
  }


  addHoraExtra(){
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'horaextra',
      maxWidth:  this.isMobile ? '90dvw' : '40vw',
      minWidth: this.isMobile ? '90dvw' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listFiltrada = []
      this.getReportsByUser(this.user.id);
    });
  }

  descargarExcel() {
    let listExcel = this.listFiltrada;
    listExcel = listExcel.map(horaExtra => {
      const { fecha, horario, hora, cantidad, fechaString, idDocumento, empleados, ...datos} = horaExtra;
      return datos;
    });
    const sheet = XLSX.utils.json_to_sheet(listExcel);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Hoja1');
    XLSX.writeFile(book, 'Resumen.xlsx');
  }

  detailHoraExtra(horaExtra: HoraExtra){
    const dialogRef = this.dialog.open(PopupAddHourexComponent, {
      data: {
        horaExtra: horaExtra,
        detail: true
      } ,
      maxWidth:  this.isMobile ? '90dvw' : '100vw',
      minWidth: this.isMobile ? '90dvw' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
