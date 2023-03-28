import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit{
  sistema: string[] = [];
  miMunsac: boolean = false;
  munsacAyuda: boolean = false;
  munsacEnvios: boolean = false;
  munsacPV: boolean = false;
  webMunsac: boolean = false;
  loading: boolean = true;
  primerNombre: string = "";
  primerApellido: string = "";
  nombreCompleto: string = "";

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private auth: AuthService
    ){}

  ngOnInit(): void {


    this.afAuth.onAuthStateChanged((user) => {

      if (user) {
        const sub = this.auth.getUserByEmail(user.email, 'correo').subscribe((empleado=>{
          this.sistema = empleado[0].sistema;
          this.sistema.forEach((element)=>{
            if(element === 'crmEnvios'){
              this.munsacEnvios = true;
            }
            if(element === 'miMunsac'){
              this.miMunsac = true;
            }
            if(element === 'munsacPV'){
              this.munsacPV = true;
            }
            if(element === 'munsacAyuda'){
              this.munsacAyuda = true;
            }
            if(element === 'munsacWeb'){
              this.webMunsac = true;
            }
            this.loading = false;
          });
          var partesNombre = empleado[0].nombre.split(" ");
          this.primerNombre = partesNombre[0];
          this.primerApellido = partesNombre[2];
          this.nombreCompleto = this.primerNombre+" "+this.primerApellido;
          sub.unsubscribe();
        })
        );
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

}
