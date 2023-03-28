import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';
import { Report } from 'src/app/models/Report';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { getDaysInMonth } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit{
  listReports: Report[] = [];
  listFiltrada: Report[] = [];
  nombre: string | undefined;
  loading: boolean = true;
  horaFormateada: any;
  horaBD: any;
  mes: number | undefined;
  anio: number | undefined;
  fecha: string | undefined;
  listVacia: boolean = false;
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
  dias: string[] = [];
  selectDia: any;
  selectMes: any;
  diaSelected: any;
  mesSelected: any;
  documentos: string[] = [];

  constructor(
    private router: Router,
    private _reportService: ReportsService,
    private _authService: AuthService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private storage: Storage,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.mes = new Date().getMonth();
    this.llenarMes(this.mes+1); 
    this.selectDia = new Date().getDate().toString();
    this.selectMes = this.meses[this.mes];
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.getReports();
      }
    });
  }

  getReports(){
    this._reportService.getReports().subscribe((doc)=>{
      this.listReports = [];
      doc.forEach((element: any) => {           
        var reporte = {
          id: element.payload.doc.id,
          nombre: '',
          fecha: element.payload.doc.data().fecha,
          descripcion: element.payload.doc.data().descripcion,
          hora: '',
          horario: '',
          fechaString: element.payload.doc.data().fechaString,
          ubicacion: element.payload.doc.data().ubicacion,
          urlImagen: element.payload.doc.data().urlImagen,
          lat: element.payload.doc.data().ubicacion['_lat'],
          long: element.payload.doc.data().ubicacion['_long'],
        }

        const sub = this._authService.getUserById(element.payload.doc.data().idUsuario).subscribe((user)=>{
          sub.unsubscribe();
          reporte.nombre = user.nombre;
        });

        var hora = reporte.fecha.seconds;          
        const fechaHora = new Date();
        fechaHora.setTime(hora * 1000);
        this.horaFormateada = this.datePipe.transform(fechaHora, 'HH:mm');   
        this.horaBD = this.datePipe.transform(fechaHora, 'HH');   
        reporte.hora = this.horaFormateada;   
        if(this.horaBD <= 11){
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
    this.anio = new Date().getFullYear();
    this.diaSelected = (<HTMLInputElement>document.getElementById('diaSelected')).value;
    this.mesSelected = (<HTMLInputElement>document.getElementById('mesSelected')).value;
    this.fecha = this.diaSelected+"."+this.mesSelected+"."+this.anio;

    this.listReports.forEach((element)=>{
      if(this.fecha == element.fechaString){
        this.listFiltrada.push(element);        
      }
    });
  
    if(this.listFiltrada.length<=0){
      this.listVacia = true;
      this.toastr.info('No se encontraron reportes');
    }else{
      this.toastr.success('Reportes encontrados')
    }
    this.loading=false;
  }

  llenarMes(mes: any){
    this.dias = [];
    const year = new Date().getFullYear();
    const daysInMonth = getDaysInMonth(new Date(year, parseInt(mes)-1));

    for (let i = 1; i <= daysInMonth; i++) {
      var dia = i.toString();
      this.dias.push(dia);          
    }    
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
