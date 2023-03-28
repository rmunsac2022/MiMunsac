import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Requests } from 'src/app/models/Request';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PopupRequestComponent } from 'src/app/components/popup-request/popup-request.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit{
  listRequests: Requests[] = [];
  listFiltrada: Requests[] = [];
  listPendiente: Requests[] = [];
  listAprobada: Requests[] = [];
  listRechazado: Requests[] = [];
  hora: any;
  loading: boolean = true;
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
  mes: any;
  anios: string[] = ['2023', '2024', '2025', '2026', '2027', '2028'];
  selectAnio: any;
  selectMes: any;
  listVacia: boolean = false;
  mesSelected: any;
  anioSelected: any;
  anio: number | undefined;
  fecha: string | undefined;
  cambioFiltrada: boolean = false;
  cambioPendiente: boolean = false;
  cambioAprobado: boolean = false;
  cambioRechazado: boolean = false;
  listBotones: any;
  listSend: any;

  constructor(
    private router: Router,
    private _requestsService: RequestService,
    private _authService: AuthService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public _userService: AuthService,
    private dialog: MatDialog,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.mes = new Date().getMonth();
    this.selectAnio = new Date().getFullYear();
    this.selectMes = this.meses[this.mes];

    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.getRequests();
      }
    });
  }

  getRequests(){
    this._requestsService.getRequests().subscribe((doc)=>{
      this.listRequests = [];
      doc.forEach((element: any) => { 
        var request = {
          id: element.payload.doc.id,
          nombre: '',
          hora: '',
          emoji: '',
          fecha: element.payload.doc.data().fecha,
          descripcion: element.payload.doc.data().descripcion,
          leido: element.payload.doc.data().leido,
          categoria: element.payload.doc.data().categoria,
          rangoSolicitados: element.payload.doc.data().rangoSolicitados,
          urlDocumento: element.payload.doc.data().urlDocumento,
          horario: '',
          fechaString: element.payload.doc.data().fechaString,
          estado: element.payload.doc.data().estado,
          name: '',
          apellido: '',
          correo:'',
          rut:'',
          telefono: ''
        }  

        const sub = this._authService.getUserById(element.payload.doc.data().idUsuario).subscribe((user)=>{
          sub.unsubscribe();
          request.nombre = user.nombre;   
          request.emoji = user.emoji; 
          request.correo = user.correo;
          request.rut = user.rut;
          request.telefono = user.telefono;
          
          var partesNombre = request.nombre.split(" ");
          var primerNombre = partesNombre[0];
          var primerApellido = partesNombre[2];
  
          request.name = primerNombre;
          request.apellido = primerApellido;
        });
        
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
        this.listRequests.push(request);  
      });
      this.filtrar();
    });
  }

  filtrar(){ 
    this.listAprobada = [];
    this.listRechazado = [];
    this.listPendiente = [];
    this.listVacia = false;
    this.listFiltrada = [];
    this.anioSelected = (<HTMLInputElement>document.getElementById('anioSelected')).value;
    this.mesSelected = (<HTMLInputElement>document.getElementById('mesSelected')).value;
    this.fecha = this.mesSelected+"."+this.anioSelected;

    this.listRequests.forEach((element)=>{
      var partesFecha = element.fechaString!.split(".");

      var mes = partesFecha[1];
      var anio = partesFecha[2];
      var fechaBD = mes + "." + anio;

      if(this.fecha == fechaBD){
        this.listFiltrada.push(element);        
      }
    });
    var idBtn = document.getElementById('boton1');
    this.filtrarPendiente(idBtn);
    this.loading = false;
  }

  filtrarPendiente(boton :any){
    this.listPendiente = [];
    this.switchBotones(boton)
    this.listFiltrada.forEach((element)=>{
      if(element.estado === 'pendiente'){
        this.listPendiente.push(element);
      }
    })
    this.listVacio(this.listPendiente);
    this.cambioAprobado = false;
    this.cambioRechazado = false;
    this.cambioPendiente = true;
    this.listAprobada = [];
    this.listRechazado = [];
  }

  filtrarAprobado(boton: any){
    this.listAprobada = [];
    this.switchBotones(boton)
    this.listFiltrada.forEach((element)=>{
      if(element.estado === 'aprobado'){
        this.listAprobada.push(element);
      }
    })
    this.listVacio(this.listAprobada);
    this.cambioRechazado = false;
    this.cambioPendiente = false;
    this.cambioAprobado = true;
    this.listPendiente = [];
    this.listRechazado = [];
  }

  filtrarRechazado(boton: any){
    this.listRechazado = [];
    this.switchBotones(boton)
    this.listFiltrada.forEach((element)=>{
      if(element.estado === 'rechazado'){
        this.listRechazado.push(element);
      }
    })
    this.listVacio(this.listRechazado);
    this.cambioAprobado = false;
    this.cambioPendiente = false;
    this.cambioRechazado = true;
    this.listPendiente = [];
    this.listAprobada = [];
  }

  switchBotones(btn: any){
    var boton1 = document.getElementById('boton1');
    var boton2 = document.getElementById('boton2');
    var boton3 = document.getElementById('boton3');

    boton1?.classList.remove('bg-verdemun')
    boton2?.classList.remove('bg-verdemun')
    boton3?.classList.remove('bg-verdemun')
    boton1?.classList.add('bg-verdemunfond')
    boton2?.classList.add('bg-verdemunfond')
    boton3?.classList.add('bg-verdemunfond')
    btn.classList.remove('bg-verdemunfond');
    btn.classList.add('bg-verdemun');
  }

  listVacio(list: any){
    if(list.length<=0){
      this.listVacia = true;
      this.toastr.info('No se encontraron solicitudes');
    }else{
      this.listVacia = false;
      this.toastr.success('Solicitudes encontradas');
    }
  }

  filtrar2(){   
    this.listAprobada = [];
    this.listRechazado = [];
    this.listPendiente = [];
    this.listVacia = false;
    this.listFiltrada = [];
    this.anioSelected = (<HTMLInputElement>document.getElementById('anioSelected')).value;
    this.mesSelected = (<HTMLInputElement>document.getElementById('mesSelected')).value;
    this.fecha = this.mesSelected+"."+this.anioSelected;

    this.listRequests.forEach((element)=>{
    var partesFecha = element.fechaString!.split(".");

    var mes = partesFecha[1];
    var anio = partesFecha[2];
    var fechaBD = mes + "." + anio;

    if(this.fecha == fechaBD){
      this.listFiltrada.push(element);        
    }
    });
    this.listFiltrada.forEach((element)=>{
      if(element.estado === 'pendiente'){
        this.listPendiente.push(element);
      }
    });
    this.listFiltrada.forEach((element)=>{
      if(element.estado === 'aprobado'){
        this.listAprobada.push(element);
      }
    });
    this.listFiltrada.forEach((element)=>{
      if(element.estado === 'rechazado'){
        this.listRechazado.push(element);
      }
    });
    this.loading = false;
  }

  detailRequest(request: Requests) {
    const dialogRef = this.dialog.open(PopupRequestComponent, {
      data: request
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loading = true;
      this.filtrar2();
    });
  }

}
