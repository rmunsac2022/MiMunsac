import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ServicioTecnico } from 'src/app/models/ServicioTecnico';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-popup-info-client',
  templateUrl: './popup-info-client.component.html',
  styleUrls: ['./popup-info-client.component.css']
})
export class PopupInfoClientComponent implements OnInit {
  isMobile : boolean;
  form: FormGroup;
  botonApretado: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PopupInfoClientComponent>,
    private deviceService: DeviceDetectorService,
    private fb: FormBuilder,
    private clientService: ClientService,
    private toast: ToastrService,
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
      });
    }

  ngOnInit(): void {
    console.log(this.data);
  }

  saveData(){
    if(this.botonApretado === false){
      this.botonApretado = true;
      const ST: ServicioTecnico = {
        agenda: this.data,
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
        manillaresFrenos: this.form.value.manillaresFrenos
      }
      
      this.clientService.saveIngresoSt(ST).then(()=>{
        this.toast.success('Datos guardados');
        this.dialogRef.close();
      },
      (error: any) => {
        this.toast.error('Opps... ocurrio un error', 'Error');
        console.log(error);
      });
    }
  }
}
