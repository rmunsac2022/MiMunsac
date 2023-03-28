import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/app/services/setting.service';
import { Setting } from 'src/app/models/Setting';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit{
  notificacionMailHorario: any;
  notificacionMailRequest: any;
  notificacionMailReport: any;
  datosTienda: any;
  formSetting: FormGroup;
  showButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private settingService: SettingService,
    private toastr: ToastrService,
    private afAuth: AngularFireAuth
  ) {
    this.formSetting = this.fb.group({
      entrada: [''],
      salida: [''],
      mailHorario: [''],
      mailRequest: [''],
      mailReport: [''],
      checkHorario: [''],
      checkRequest: [''],
      checkReport: ['']
    })
  }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.getSetting();
      }
    });
  }

  getSetting(){
    const sub = this.settingService.getSetting().subscribe((doc)=>{
      sub.unsubscribe();
      this.notificacionMailHorario = doc.notificacionMail.horario;
      this.notificacionMailRequest = doc.notificacionMail.solicitud;
      this.notificacionMailReport = doc.notificacionMail.reporte;
      this.datosTienda = doc.datosTienda;

      this.formSetting.get('entrada')?.setValue(this.datosTienda.entrada);
      this.formSetting.get('salida')?.setValue(this.datosTienda.salida);
      this.formSetting.get('mailHorario')?.setValue(this.notificacionMailHorario.mailsDestino);
      this.formSetting.get('mailRequest')?.setValue(this.notificacionMailRequest.mailsDestino);
      this.formSetting.get('mailReport')?.setValue(this.notificacionMailReport.mailsDestino);
      this.formSetting.get('checkHorario')?.setValue(this.notificacionMailHorario.activo);
      this.formSetting.get('checkRequest')?.setValue(this.notificacionMailRequest.activo);
      this.formSetting.get('checkReport')?.setValue(this.notificacionMailReport.activo);
    });
  }

  guardarCambios(){
    const SETTING: Setting = {
      datosTienda: {
        entrada: this.formSetting.value.entrada,
        salida: this.formSetting.value.salida,
        gracia: '00:15'
      },
      notificacionMail: {
        horario: {
          mailsDestino: this.formSetting.value.mailHorario,
          activo: this.formSetting.value.checkHorario
        },
        reporte: {
          mailsDestino: this.formSetting.value.mailReport,
          activo: this.formSetting.value.checkReport
        },
        solicitud: {
          mailsDestino: this.formSetting.value.mailRequest,
          activo: this.formSetting.value.checkRequest
        },
      },
      version: '1'
    };    

    this.settingService.editConfiguracion(SETTING).then(
      () => {
        this.toastr.success(
          'La configuración fue actualizada con exito',
          'Configuración actualizada'
        );
        this.showButton = false;
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('Opps... ocurrio un error', 'Error');
      }
    );
  }

  mostrarBoton(){
    var datosForm = {
        entrada: this.formSetting.value.entrada,
        salida: this.formSetting.value.salida,
        mailsDestino1: this.formSetting.value.mailHorario,
        activo1: this.formSetting.value.checkHorario,
        mailsDestino2: this.formSetting.value.mailReport,
        activo2: this.formSetting.value.checkReport,
        mailsDestino3: this.formSetting.value.mailRequest,
        activo3: this.formSetting.value.checkRequest
    };

    var dataFromBD = {
        entrada: this.datosTienda.entrada,
        salida: this.datosTienda.salida,
        gracia: this.datosTienda.gracia,
        mailsDestino1: this.notificacionMailHorario.mailsDestino,
        activo1: this.notificacionMailHorario.activo,
        mailsDestino2: this.notificacionMailReport.mailsDestino,
        activo2: this.notificacionMailReport.activo,
        mailsDestino3: this.notificacionMailRequest.mailsDestino,
        activo3: this.notificacionMailRequest.activo
    }

    if(dataFromBD !== datosForm){
      this.showButton = true;
    }

  }



}
