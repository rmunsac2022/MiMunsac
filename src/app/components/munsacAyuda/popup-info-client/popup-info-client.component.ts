import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ServicioTecnico } from 'src/app/models/ServicioTecnico';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { StService } from 'src/app/services/st.service';

@Component({
  selector: 'app-popup-info-client',
  templateUrl: './popup-info-client.component.html',
  styleUrls: ['./popup-info-client.component.css']
})
export class PopupInfoClientComponent implements OnInit {
  isMobile : boolean;
  form: FormGroup;
  botonApretado: boolean = false;
  isIngreso: boolean = false;
  isRevision: boolean = false;
  diagnostico: any;
  user: any;

  constructor(
    public dialogRef: MatDialogRef<PopupInfoClientComponent>,
    private deviceService: DeviceDetectorService,
    private fb: FormBuilder,
    private clientService: ClientService,
    private toast: ToastrService,
    private afs: AngularFirestore,
    private st: StService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.form = this.fb.group({
      quiebre: [''],
      rayones: [''],
      neumaticoPinchado: [''],
      neumaticoEstable: [''],
      luzQuemada: [''],
      bocinaFuncional: [''],
      amortiguacionQuebrada: [''],
      displayQuemado: [''],
      motorFuncional: [''],
      cableadoCortado: [''],
      manillaresFrenos: [''],
      isFactura: [false],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    if(this.data.accion === 'ingresar'){
      this.isIngreso = true;
    }
    if(this.data.accion === 'revision'){
      this.isRevision = true;
    }
  }

  saveData(){
    if(this.botonApretado === false){
      this.botonApretado = true;
      const ST: ServicioTecnico = {
        datosCliente: this.data.datos.datosCliente,
        datosProducto: this.data.datos.datosProducto,
        documento: this.data.datos.documento,
        horaString: this.data.datos.horaString,
        revisiones: {
          quiebre: this.form.value.quiebre,
          rayones: this.form.value.rayones,
          neumaticoPinchado: this.form.value.neumaticoPinchado,
          neumaticoEstable: this.form.value.neumaticoEstable,
          luzQuemada: this.form.value.luzQuemada,
          bocinaFuncional: this.form.value.bocinaFuncional,
          amortiguacionQuebrada: this.form.value.amortiguacionQuebrada,
          displayQuemado: this.form.value.displayQuemado,
          motorFuncional: this.form.value.motorFuncional,
          cableadoCortado: this.form.value.cableadoCortado,
          manillaresFrenos: this.form.value.manillaresFrenos,
          isFactura: this.form.value.isFactura
        },
        estado: 'ingresado',
        diagnostico:'',
        fecha: new Date(),
        fechaString: new Date().getDay().toString()+"."+new Date().getMonth().toString()+"."+new Date().getFullYear().toString(),
        mesAnio: (new Date().getMonth()+1).toString()+"/"+new Date().getFullYear().toString(),
        comentario: this.form.value.comentario
      }
      this.clientService.saveIngresoSt(ST).then((docRef: any)=>{
        this.sendEmail(ST.datosCliente.mail, docRef.id);
        this.toast.success('Datos guardados');
        this.dialogRef.close();
      },
      (error: any) => {
        this.toast.error('Opps... ocurrio un error', 'Error');
        console.log(error);
      });
    }
  }

  llenarInput(controlName: string, event: any){
    if(event.target.checked === true){
      this.form.get(controlName)?.setValue('Verdadero');    
    }else{
      this.form.get(controlName)?.setValue('Falso');    
    }
  }

  sendEmail(mail:string, id: any){
    this.afs.collection('Correos').add({
      to: mail,
      message: {
        subject: 'Su scooter ha sido ingresado',
        html: '<p>'+id+'</p>'
      },
    }).then(() => console.log('Send email for delivery!'));
  }

  changeState(){
    this.afAuth.onAuthStateChanged((user) => {
      const sub = this.authService.getUserByEmailWithId(user!.email, 'correo').subscribe((user)=> {
        sub.unsubscribe();
        this.user = user[0].payload.doc;
        var id = this.data.id;
        if(this.diagnostico !== undefined){
          const cambios = {
            diagnostico: this.diagnostico,
            estado: 'procesoDiagnostico',
            idTecnico: this.user.id
          }
          this.st.updateScheduleSt(id, cambios).then(()=>{
            this.toast.success('Diagnostico añadido');
            this.dialogRef.close();
          },(error: any) => {
            console.log(error);
            this.toast.error('Opps... ocurrio un error', 'Error');
          })
        }else{
          this.toast.info('El diagnostico es requerido')
        }
      });    
    });
  }
}
