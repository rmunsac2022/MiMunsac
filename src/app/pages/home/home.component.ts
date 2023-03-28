import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  fecha: any;
  meses: string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  listRequest: any;
  cantRequests: any;
  cantReports: any;
  loading: boolean = true;
  today: any;
  mes: number | undefined;
  dia: number | undefined;
  anio: number | undefined;
  cantUrgentes: any;
  
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
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
    this.getRequest();
    this.getReports();
    /*this.productsService.getProducts().subscribe(data => {
      console.log(data);      
    });*/
  }

  getRequest(){
    this.firestore.collection('MunsacControl').doc('registros').collection('Solicitudes', ref => ref.where('leido', '==', false)).get().toPromise().then(querySnapshot => {
      if (querySnapshot) {
        this.cantRequests = querySnapshot.size;
      }
    });
    this.firestore.collection('MunsacControl').doc('registros').collection('Solicitudes', ref => ref.where('categoria', '==', 'urgente')).get().toPromise().then(querySnapshot => {
      if (querySnapshot) {
        this.cantUrgentes = querySnapshot.size;
      }
    });
  }

  getReports(){
    this.mes = new Date().getMonth()+1;
    this.today = (this.anio + "." + this.mes + "." +this.dia);    
          
    this.firestore.collection('MunsacControl').doc('registros').collection('Reportes', ref => ref.where('fechaString', '==', this.today)).get().toPromise().then(querySnapshot => {
      if (querySnapshot){
        this.cantReports = querySnapshot.size;
        this.loading = false;
      }
    });
  }
}
