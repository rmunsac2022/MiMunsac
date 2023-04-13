import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Requests } from 'src/app/models/Request';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { SettingService } from 'src/app/services/setting.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-popup-create-request',
  templateUrl: './popup-create-request.component.html',
  styleUrls: ['./popup-create-request.component.css']
})
export class PopupCreateRequestComponent implements OnInit {
  registrarSolicitud: FormGroup;
  fecha: any;
  meses: string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  loading: boolean = true;
  mes: number | undefined;
  dia: number | undefined;
  anio: number | undefined;
  user: any;
  userData: User = new User;
  timestamp: any;
  fechaString: string = "";
  files: any;
  packageIdImages: string | undefined;
  minDate: string;

  constructor(
    public dialogRef: MatDialogRef<PopupCreateRequestComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private requestService: RequestService,
    private toastr: ToastrService,
    private storage: Storage,
    private settingService: SettingService,
    private afs: AngularFirestore
  ) { 
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 24);
    this.minDate = currentDate.toISOString().slice(0, 16);

    this.registrarSolicitud = this.fb.group({
      descripcion: [''],
      categoria: [''],
      estado: [''],
      fecha: [''],
      fechaString: [''],
      idUsuario: [''],
      leido: [''],
      rangoSolicitado: [''],
      urlDocumento: [''],
      desde: [''],
      hasta: ['']
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

  crearSolicitud(){
    const rangoSolicitado = {
      desde: this.registrarSolicitud.value.desde,
      hasta: this.registrarSolicitud.value.hasta
    }
    const timestamp = {
      desde: new Date(rangoSolicitado.desde),
      hasta: new Date(rangoSolicitado.hasta)
    }
    this.packageIdImages = new Date().getTime().toString();
    const REQUEST: Requests = {
      descripcion: this.registrarSolicitud.value.descripcion,
      categoria: this.registrarSolicitud.value.categoria,
      urlDocumento: this.packageIdImages,
      fecha: this.timestamp,
      fechaString: this.fechaString,
      estado: 'pendiente',
      idUsuario: this.user.id,
      leido: false,
      rangoSolicitados: timestamp,
      motivoRechazo: ''
    };
    this.requestService.crearRequest(REQUEST).then(
      () => {
        this.toastr.success(
          'La solicitud fue registrado con exito!',
          'Solicitud registrada'
        );
        for (const file of this.files) {
          const imgRef = ref(
            this.storage,
            `solicitudes/${this.packageIdImages}/${file.name}`
          );
          uploadBytes(imgRef, file)
            .then((x) => {})
            .catch((error) => console.log(error));
        }
        this.sendEmail();
        this.registrarSolicitud.reset();
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

  sendEmail() {
    const sub = this.settingService.getSetting().subscribe((doc)=>{
      sub.unsubscribe();
      var correos = doc.notificacionMail.solicitud.mailsDestino.split(", ");
      correos.forEach((email: any)=>{
        this.afs.collection('Correos').add({
          to: email,
          message: {
            subject: this.userData.name! +" "+ this.userData.apellido! + ' a hecho una solicitud',
            html: '<p>Visita Munsac Control para ver los detalles</p>'
          },
        }).then(() => console.log('Send email for delivery!'));
      });
    });
  }

}
