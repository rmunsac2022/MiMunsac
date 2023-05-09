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
import { HorariosService } from 'src/app/services/horarios.service';
import { Horario } from 'src/app/models/Horario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SettingService } from 'src/app/services/setting.service';

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
  idReport: string = '';
  elementHorario: any;

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
    private horarioService: HorariosService,
    private afs: AngularFirestore,
    private settingService: SettingService
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
      (docRef) => {
        this.idReport = docRef.id;
        this.actualizarHorario(this.idReport, REPORT.categoria);
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
        };
        this.sendEmail();
        this.registrarReporte.reset();
        this.dialogRef.close();
      },
      (error: any) => {
        this.toastr.error('Opps... ocurrio un error', 'Error');
        console.log(error);
      }
    );
  }

  actualizarHorario(idReport: string, categoria: any){
    const sub = this.horarioService.getHorarioByIdUserAndDate(this.user.id, 'idUsuario', this.fechaString).subscribe((horario)=>{
      sub.unsubscribe();
      if(horario.length>0){
        horario.forEach((element: any) => {
          this.elementHorario = {
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
          }
        });
        if(categoria === 'llegada'){
          this.elementHorario.idReporteEntrada.push(idReport)
          const HORARIO: Horario = {
            idReporteEntrada: this.elementHorario.idReporteEntrada
          }
          this.horarioService.editHorario(this.elementHorario.id, HORARIO).then(
            () => {
              this.toastr.success('Reporte enlazado')
            },
            (error: any) => {
              console.log(error);
            }
          );
        }
        if(categoria === 'salida'){
          this.elementHorario.idReporteSalida.push(idReport)
          const HORARIO: Horario = {
            idReporteSalida: this.elementHorario.idReporteSalida
          }
          this.horarioService.editHorario(this.elementHorario.id, HORARIO).then(
            () => {
              this.toastr.success('Reporte enlazado')
            },
            (error: any) => {
              console.log(error);
            }
          );
        }
      }else{
        const LLEGADA: Horario = {
          fecha: new Date(),
          fechaString: this.fechaString,
          mesAnio: (new Date().getMonth()+1).toString()+"/"+new Date().getFullYear().toString(),
          idUsuario: this.user.id,
          idReporteEntrada: [idReport],
          idReporteSalida: [],
          horario: {
            llegada: '',
            salida:''
          }
        };
        this.horarioService.generarLlegada(LLEGADA).then(
          () => {
            this.toastr.info('Registro generado')
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    });
  }

  subirArchivo($event: any) {
    this.files = $event.target.files;
  }

  sendEmail() {
    const sub = this.settingService.getSetting().subscribe((doc)=>{
      sub.unsubscribe();
      var correos = doc.notificacionMail.reporte.mailsDestino.split(", ");
      correos.forEach((email: any)=>{
        this.afs.collection('Correos').add({
          to: email,
          message: {
            subject: this.userData.name! + this.userData.apellido! + ' a hecho un reporte',
            html: '<p>Visita Munsac Control para ver los detalles</p>'
          },
        }).then(() => console.log('Send email for delivery!'));
      });
    });
  }

}
