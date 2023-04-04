import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopupCreateReportComponent } from 'src/app/components/popup-create-report/popup-create-report.component';
import { Report } from 'src/app/models/Report';
import { AuthService } from 'src/app/services/auth.service';
import { ReportsService } from 'src/app/services/reports.service';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { PermissionRequestService } from 'src/app/services/permission-request.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
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
  listReports: Report[] = [];
  listFiltrada: Report[] = [];
  listVacia: boolean = false;
  loading: boolean = true;
  anios: string[] = ['2023', '2024', '2025', '2026', '2027', '2028'];
  mesSelected: any;
  anioSelected: any;
  hora: any;
  fecha: string | undefined;
  mes: any;
  selectAnio: any;
  selectMes: any;
  user: any;
  documentos: string[] = [];
  id: string | undefined;
  deviceInfo : any;
  isMobile : boolean;

  constructor(
    private dialog: MatDialog,
    private reportService: ReportsService,
    private datePipe: DatePipe,
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private storage: Storage,
    private toastr: ToastrService,
    private permissionService: PermissionRequestService,
    private deviceService: DeviceDetectorService) { 
      this.isMobile = this.deviceService.isMobile();
    }

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

  crearReporte(){
    const dialogRef = this.dialog.open(PopupCreateReportComponent, {
      data: '',
      minWidth: this.isMobile ? '90dvw' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listFiltrada = [];
      this.getReportsByUser(this.id!);
    });
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
      this.id = this.user.id;
      this.getReportsByUser(this.user.id);
    });
  }
  
  getReportsByUser(id: string){
    this.reportService.getReportByIdUser(id, 'idUsuario').subscribe((doc)=>{
      this.listReports = [];
      doc.forEach((element: any) => { 
        var reporte = {
          nombre: '',
          fecha: element.fecha,
          descripcion: element.descripcion,
          hora: '',
          horario: '',
          fechaString: element.fechaString,
          ubicacion: element.ubicacion,
          urlImagen: element.urlImagen,
          lat: element.ubicacion['_lat'],
          long: element.ubicacion['_long'],
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
        this.listReports.push(reporte);  
      });
      if(this.listReports.length<=0){
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

    this.listReports.forEach((element)=>{
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
      //this.toastr.info('No se encontraron reportes')
    }else{
      //this.toastr.success('Reportes encontrados')
    }
    this.loading = false;
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
