import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupCreateRequestComponent } from 'src/app/components/popup-create-request/popup-create-request.component';
import { Requests } from 'src/app/models/Request';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionRequestService } from 'src/app/services/permission-request.service';
import { RequestService } from 'src/app/services/request.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupDetailRequestComponent } from 'src/app/components/popup-detail-request/popup-detail-request.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
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
  mes: any;
  selectAnio: any;
  selectMes: any;
  listRequest: Requests[] = [];
  listFiltrada: Requests[] = [];
  mesSelected: any;
  anioSelected: any;
  listVacia: boolean = false;
  fecha: string | undefined;
  loading: boolean = true;
  user: any;
  hora: any;
  id: string | undefined;
  isMobile : boolean;
  data: any;

  constructor(
    private dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private requestService: RequestService,
    private datePipe: DatePipe,
    private permissionService: PermissionRequestService,
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

  crearRequest(){
    const dialogRef = this.dialog.open(PopupCreateRequestComponent, {
      data: '',
      minWidth: this.isMobile ? '90dvw' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listFiltrada = [];
      this.getRequestByUser(this.id!);
    });
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
      this.data = user[0].payload.doc.data();
      this.id = this.user.id;
      this.getRequestByUser(this.user.id);
    });
  }

  getRequestByUser(id: string){
    this.requestService.getRequestByIdUser(id, 'idUsuario').subscribe((doc)=>{
      this.listRequest = [];
      doc.forEach((element: any) => { 
        var request = {
          nombre: '',
          hora: '',
          emoji: '',
          fecha: element.fecha,
          descripcion: element.descripcion,
          leido: element.leido,
          categoria: element.categoria,
          rangoSolicitados: element.rangoSolicitados,
          urlDocumento: element.urlDocumento,
          horario: '',
          fechaString: element.fechaString,
          estado: element.estado,
          name: '',
          apellido: '',
          correo:'',
          rut:'',
          telefono: ''
        } 
        var hora = request.fecha.seconds;          
        const fechaHora = new Date();
        fechaHora.setTime(hora * 1000);
        this.hora = this.datePipe.transform(fechaHora, 'HH');   
        request.hora = this.hora; 
        
        if(this.hora <= 11){
          request.horario = 'AM'
        }else{
          request.horario = 'PM'
        }
        this.listRequest.push(request);  
      });
      if(this.listRequest.length<=0){
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

    this.listRequest.forEach((element)=>{
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
      //this.toastr.info('No se encontraron solicitudes')
    }else{
      //this.toastr.success('Solicitudes encontradas')
    }
    this.loading = false;
  }

  detailRequest(request: Requests) {
    const dialogRef = this.dialog.open(PopupDetailRequestComponent, {
      data: {
        request: request,
        user: this.data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
