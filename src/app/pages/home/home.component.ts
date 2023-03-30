import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { PopupTickQrComponent } from 'src/app/components/popup-tick-qr/popup-tick-qr.component';
import { PopupCreateReportComponent } from 'src/app/components/popup-create-report/popup-create-report.component';

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
  
  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
    this.mes = new Date().getMonth();
    this.dia = new Date().getDate();
    this.anio = new Date().getFullYear();
    this.fecha = (this.dia + " de " + this.meses[this.mes] + " del " + this.anio);
    this.getReports();
  }

  getReports(){
    this.mes = new Date().getMonth()+1;
    this.today = (this.anio + "." + this.mes + "." +this.dia);    
          
    this.firestore.collection('MunsacControl').doc('registros').collection('Reportes', ref => ref.where('fechaString', '==', this.today)).get().toPromise().then(querySnapshot => {
      if (querySnapshot){
        this.loading = false;
      }
    });
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

  crearReporte(){
    const dialogRef = this.dialog.open(PopupCreateReportComponent, {
      data: 'asd'
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
