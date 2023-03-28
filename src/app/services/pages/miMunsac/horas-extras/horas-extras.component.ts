import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupHorasExtrasComponent } from 'src/app/components/popup-horas-extras/popup-horas-extras.component';
import { Router } from '@angular/router';
import { HorasExtrasService } from 'src/app/services/horas-extras.service';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.css']
})

export class HorasExtrasComponent implements OnInit {
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
  mes: number | undefined;
  selectAnio: any;
  selectMes: any;
  anios: string[] = ['2023', '2024', '2025', '2026', '2027', '2028'];
  listVacia: boolean = false;
  loading: boolean = true;
  listHoras: HoraExtra[] = [];
  listFiltrada: HoraExtra[] = [];
  listFiltradaName: HoraExtra[] = [];
  hora: any;
  fecha: any;
  anioSelected: any;
  mesSelected: any;
  listParticipantes: any;
  fechaMes: any;
  fechaAnio: any;
  searchNombre: string = '';
  cambioList: boolean = false;
  listExcel: any;
  nombre: string = '';
  listNombres: string[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _horasExtrasService: HorasExtrasService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private _authService: AuthService,
    private afAuth: AngularFireAuth,
    ) {}

  ngOnInit(){
    this.mes = new Date().getMonth();
    this.selectAnio = new Date().getFullYear();
    this.selectMes = this.meses[this.mes];
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.getHorasExtras();
      }
    });
  }

  crearHoraExtra(){
    const dialogRef = this.dialog.open(PopupHorasExtrasComponent, {
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getHorasExtras();
    });
  }

  detailHoraExtra(hora: any){
    const dialogRef = this.dialog.open(PopupHorasExtrasComponent, {
      data: hora
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getHorasExtras();
    });
  }

  getHorasExtras(){
    const sub = this._horasExtrasService.getHoraExtra().subscribe((doc)=>{
      sub.unsubscribe();
      this.listHoras = [];
      doc.forEach((element: any) => { 
        var horaExtra = {
          id: element.payload.doc.id,
          nombreProyecto: element.payload.doc.data().nombreProyecto,
          emoji: element.payload.doc.data().emoji,
          fecha: element.payload.doc.data().fecha,
          cantidad: element.payload.doc.data().cantidad,
          descripcion: element.payload.doc.data().descripcion,
          valor: element.payload.doc.data().valor,
          cantParticipantes: '',
          nombreRut:'',
          empleados: element.payload.doc.data().empleados,
          desde: element.payload.doc.data().cantidad.desde,
          hasta: element.payload.doc.data().cantidad.hasta,
          modalidad: element.payload.doc.data().modalidad,
          fechaString: element.payload.doc.data().fechaString,
          hora: '',
          horario: '',
          idDocumento: element.payload.doc.data().idDocumento
        }
        horaExtra.cantParticipantes = horaExtra.empleados.length;
        horaExtra.empleados.forEach((empleado: any)=>{
          const sub = this._authService.getUserById(empleado).subscribe((user)=>{
            sub.unsubscribe();
            var nombre = user.nombre;   
            var partesNombre = nombre.split(" ");
            var primerNombre = partesNombre[0];
            var primerApellido = partesNombre[2];
            var rut = user.rut;
            if(element.nombreRut===undefined){
              element.nombreRut = '';
            }
            element.nombreRut = element.nombreRut+"/"+primerNombre+primerApellido+"/"+rut;
            horaExtra.nombreRut = element.nombreRut;
          });
        });

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
        this.listHoras.push(horaExtra);  
      });
      this.filtrar();
    });
  }

  filtrar(){   
    this.listVacia = false;
    this.listFiltrada = [];
    this.anioSelected = (<HTMLInputElement>document.getElementById('anioSelected')).value;
    this.mesSelected = (<HTMLInputElement>document.getElementById('mesSelected')).value;

    this.fechaAnio = this.anioSelected;
    this.fechaMes = this.meses[this.mesSelected-1];
    this.fecha = this.mesSelected+"."+this.anioSelected;

    this.listHoras.forEach((element)=>{
      var partesFecha = element.fechaString!.split(".");

      var mes = partesFecha[1];
      var anio = partesFecha[2];
      var fechaBD = mes + "." + anio;

      if(this.fecha == fechaBD){
        this.listFiltrada.push(element);        
      }
    });
    this.listVacio(this.listFiltrada);
    this.searchNombre = '';
    this.cambioList =  false;
    this.loading = false;
  }

  listVacio(list: any){
    if(list.length<=0){
      this.listVacia = true;
      this.toastr.info('No se encontraron horas extras');
    }else{
      this.listVacia = false;
      this.toastr.success('Horas extras encontradas');
    }
  }

  filtrarNombre(){
    this.listFiltradaName = [];
    this.searchNombre = this.searchNombre.toUpperCase();
    this.listFiltrada.forEach((element)=>{
      element.nombreProyecto = element.nombreProyecto!.toUpperCase();
      if(element.nombreProyecto === this.searchNombre){
        this.listFiltradaName.push(element);
      }
    });
    if(this.searchNombre === ''){
      this.cambioList =  false;
      this.listVacio(this.listFiltrada);
    }else{
      this.cambioList = true;
      this.listVacio(this.listFiltradaName);
    }
  }

  descargarExcel() {
    let listExcel = this.listFiltrada;
    listExcel = listExcel.map(horaExtra => {
      const { fecha, cantidad, horario, hora, fechaString, idDocumento, empleados, ...datos} = horaExtra;
      return datos;
    });
    const sheet = XLSX.utils.json_to_sheet(listExcel);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Hoja1');
    XLSX.writeFile(book, 'Resumen.xlsx');
  }

}

