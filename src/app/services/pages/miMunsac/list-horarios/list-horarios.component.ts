import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getDaysInMonth } from 'date-fns';
import { PopupRegistroHorariosComponent } from 'src/app/components/popup-registro-horarios/popup-registro-horarios.component';

@Component({
  selector: 'app-list-horarios',
  templateUrl: './list-horarios.component.html',
  styleUrls: ['./list-horarios.component.css']
})
export class ListHorariosComponent implements OnInit{
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
  mes: any
  selectAnio: any;
  selectMes: any;
  anios: string[] = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
    this.mes = new Date().getMonth();
    this.llenarMes(this.mes+1);
    this.selectAnio = new Date().getFullYear().toString();
    this.selectMes = this.meses[this.mes];
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

  getHorario(dia: any, mes: any){
    const dialogRef = this.dialog.open(PopupRegistroHorariosComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
