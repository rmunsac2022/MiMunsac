import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Report } from 'src/app/models/Report';
import { AuthService } from 'src/app/services/auth.service';
import { ReportsService } from 'src/app/services/reports.service';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { User } from 'src/app/models/User';
import { GeoPoint } from 'firebase/firestore';

@Component({
  selector: 'app-popup-create-report',
  templateUrl: './popup-create-report.component.html',
  styleUrls: ['./popup-create-report.component.css']
})
export class PopupCreateReportComponent implements OnInit {
  fecha: any;
  meses: string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  loading: boolean = true;
  mes: number | undefined;
  dia: number | undefined;
  anio: number | undefined;
  user: any;
  userData: User = new User;
  registrarReporte: FormGroup;
  files: any;
  packageIdImages: string | undefined;
  timestamp: any;
  fechaString: string = "";
  geopoint: any;
  
  constructor(
    public dialogRef: MatDialogRef<PopupCreateReportComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private fb: FormBuilder,
    private reportService: ReportsService,
    private toastr: ToastrService,
    private storage: Storage,
  ) { 
    this.registrarReporte = this.fb.group({
      descripcion: [''],
      categoria: [''],
      urlImagen: [''],
      fecha: [''],
      fechaString: [''],
      idUsuario: [''],
      ubicacion: ['']
    });
  }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      this.getUser(user!.email)
    });
    this.timestamp = new Date();
    this.mes = new Date().getMonth();
    this.dia = new Date().getDate();
    this.anio = new Date().getFullYear();
    this.fecha = (this.dia + " de " + this.meses[this.mes] + " del " + this.anio);
    this.fechaString = this.dia+"."+(this.mes+1)+"."+this.anio;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.geopoint = new GeoPoint(latitude, longitude);
      }, (error) => {
        console.error('Error al obtener la ubicación: ', error);
      });
    }
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
      this.userData = this.user.data();
      var partesNombre = this.userData.nombre!.split(" ");
      var primerNombre = partesNombre[0];
      var primerApellido = partesNombre[2];
      this.userData.name = primerNombre;
      this.userData.apellido = primerApellido;
    });
  }

  crearReporte(){
    this.packageIdImages = new Date().getTime().toString();
    const REPORT: Report = {
      descripcion: this.registrarReporte.value.descripcion,
      categoria: this.registrarReporte.value.categoria,
      urlImagen: this.packageIdImages,
      fecha: this.timestamp,
      fechaString: this.fechaString,
      idUsuario: this.user.id,
      ubicacion: this.geopoint
    };
    this.reportService.crearReporte(REPORT).then(
      () => {
        this.toastr.success(
          'El reporte fue registrado con exito!',
          'Reporte registrado'
        );
        for (const file of this.files) {
          const imgRef = ref(
            this.storage,
            `reportes/${this.packageIdImages}/${file.name}`
          );
          uploadBytes(imgRef, file)
            .then((x) => {})
            .catch((error) => console.log(error));
        }
        this.registrarReporte.reset();
        this.dialogRef.close();
      },
      (error: any) => {
        this.toastr.error('Opps... ocurrio un error', 'Error');
        console.log(error);
      }
    );
  }

  subirArchivo($event: any) {
    this.files = $event.target.files;
  }

}
