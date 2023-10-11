import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxScannerQrcodeService,ScannerQRCodeResult, NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { BehaviorSubject } from 'rxjs';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { HorariosService } from 'src/app/services/horarios.service';
import { HorasExtrasService } from 'src/app/services/horas-extras.service';
import { PopupAddHourexComponent } from '../popup-add-hourex/popup-add-hourex.component';
import { Horario } from 'src/app/models/Horario';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { PopupActionSuccessComponent } from '../popup-action-success/popup-action-success.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/services/client.service';
import { PopupInfoClientComponent } from '../munsacAyuda/popup-info-client/popup-info-client.component';
import { StService } from 'src/app/services/st.service';

interface ScannerQRCodeConfig {
  isBeep: boolean;
  fps: number;
  constraints: MediaStreamConstraints; // Esta propiedad debe ser de tipo MediaStreamConstraints
};

@Component({
  selector: 'app-popup-tick-qr',
  templateUrl: './popup-tick-qr.component.html',
  styleUrls: ['./popup-tick-qr.component.css']
})

export class PopupTickQrComponent implements OnInit, OnDestroy {
  camaras: string[] = [];
  camarasName: string[] = [];
  camaraselect: any;
  uObject: any;
  isMobile : boolean;
  isContent: boolean = false;
  valuess: any;
  valorQr: any;
  hora: string = '';
  mes: any;
  dia: any;
  anio: any;
  fechaString: string = '';
  user: any;
  horaActual: any;
  minutoActual: any;
  escaneoRealizado: boolean = false;
  horaExtraObj: HoraExtra = new HoraExtra;
  public qrCodeResult: NgxScannerQrcodeService[] = [];
  $subject: BehaviorSubject<ScannerQRCodeResult[]> = new BehaviorSubject<ScannerQRCodeResult[]>([]);
  
  @ViewChild('ac', { static: false }) ac?: NgxScannerQrcodeComponent;
  
  

  
  config: ScannerQRCodeConfig = {
    isBeep: false,
    fps: 60,
    constraints: { 
      audio: false,
      video: {
        width: { min: 640, max: 2560 },
        height: { min: 640, max: 2560 },
        aspectRatio: { ideal: 1 }
      },
    }
  };

  constructor(
    public dialogRef: MatDialogRef<PopupTickQrComponent>,
    private dialog: MatDialog,
    private horaExtraService: HorasExtrasService,
    private horarioService: HorariosService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private deviceService: DeviceDetectorService,
    private toast: ToastrService,
    private clientService: ClientService,
    private stService: StService,
    @Inject(MAT_DIALOG_DATA) 
    public data: any
    ) {
      this.isMobile = this.deviceService.isMobile();
    }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      this.getUser(user!.email)
    });

    this.valorQr = this.data;
    const ahora = new Date();
    this.horaActual = ahora.getHours();
    this.minutoActual = ahora.getMinutes();
    this.hora = this.horaActual+":"+this.minutoActual;

    this.mes = new Date().getMonth()+1;
    this.dia = new Date().getDate();
    this.anio = new Date().getFullYear();
    this.fechaString = this.dia+"."+this.mes+"."+this.anio;
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmailWithId(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0].payload.doc;
    });
  }

  ngAfterViewInit() {
    if (this.ac) {
      // Inicializar el componente
      this.ac.play();
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const cam = devices.filter(device => device.kind === 'videoinput');
        cam.forEach(element => {
          this.camaras.push(element.deviceId);
          this.camarasName.push(element.label);
        });
      });
    }
  }

  ngOnDestroy(){
    if (this.ac) {
      this.ac.stop();
    }
  }



  cambiarCamara(select : any, event: any) {
    this.camaraselect = select;
    if (this.ac) {
      //this.ac.stop();
      this.ac.play();
      this.ac.playDevice(select);
    }
  }

  entrada($subject : any) {
    if(this.escaneoRealizado === false){
      this.escaneoRealizado = true;
      var qr = $subject[0].value;
      const decodedString = atob(qr);
  
      var partes = decodedString.split("/");
      var fecha = partes[0];
      var text = partes[1].length;
      var munsac = partes[2];
  
      var partesFecha = fecha.split(":");
      var dia = partesFecha[0];
      var mes = partesFecha[1];
      var anio = partesFecha[2];
      var hora = partesFecha[3];
      var minuto = partesFecha[4];
  
      this.mes = this.mes.toString();
      this.dia = this.dia.toString();
      this.anio = this.anio.toString();
      this.horaActual = this.horaActual.toString();
      this.minutoActual = this.minutoActual.toString();

      if(dia === this.dia && mes === this.mes && anio === this.anio && hora === this.horaActual && minuto === this.minutoActual && text === 12 && munsac === 'miMunsac'){
        const sub = this.horarioService.getHorarioByIdUserAndDate(this.user.id, 'idUsuario', this.fechaString).subscribe((horario)=>{
          sub.unsubscribe();
          if(horario.length>0){
            if(horario[0].payload.doc.data().horario.llegada === ""){
              const ahora = new Date();
              const horaActual = ahora.getHours();
              const minutoActual = ahora.getMinutes();
              const hora = horaActual+":"+minutoActual;
              const cambios: any = {
                'horario.llegada': hora
              };
              var id = horario[0].payload.doc.id;
              this.horarioService.editHorario(id, cambios).then(
                () => {
                  const dialogRef = this.dialog.open(PopupActionSuccessComponent, {
                    data: 'ENTRADA',
                    maxWidth:  this.isMobile ? '90dvw' : '35vw',
                    minWidth: this.isMobile ? '90dvw' : 'auto'
                  });
                  this.dialogRef.close();
                  dialogRef.afterClosed().subscribe(result => {
                  });
                },
                (error: any) => {
                  console.log(error);
                }
              );
            }else{
              this.toast.info('Ya has marcado tu entrada');
              this.dialogRef.close();
            }
          }else{
            const ahora = new Date();
            const horaActual = ahora.getHours();
            const minutoActual = ahora.getMinutes();
            const hora = horaActual+":"+minutoActual;
      
            const LLEGADA: Horario = {
              fecha: new Date(),
              fechaString: this.fechaString,
              mesAnio: (new Date().getMonth()+1).toString()+"/"+new Date().getFullYear().toString(),
              idUsuario: this.user.id,
              idReporteEntrada: [],
              idReporteSalida: [],
              horario: {
                llegada: hora,
                salida:''
              }
            };
            this.horarioService.generarLlegada(LLEGADA).then(
              () => {
                const dialogRef = this.dialog.open(PopupActionSuccessComponent, {
                  data: 'ENTRADA',
                  maxWidth:  this.isMobile ? '90dvw' : '35vw',
                  minWidth: this.isMobile ? '90dvw' : 'auto'
                });
                this.dialogRef.close();
                dialogRef.afterClosed().subscribe(result => {
                });
              },
              (error: any) => {
                console.log(error);
              }
            );
          }
        });
      }else{
        this.toast.info('Código no válido');
        this.dialogRef.close();
      }
    }
  }

  salida($subject : any) {
    if(this.escaneoRealizado === false){
      this.escaneoRealizado = true;
      var qr = $subject[0].value;
      const decodedString = atob(qr);
  
      var partes = decodedString.split("/");
      var fecha = partes[0];
      var text = partes[1].length;
      var munsac = partes[2];
  
      var partesFecha = fecha.split(":");
      var dia = partesFecha[0];
      var mes = partesFecha[1];
      var anio = partesFecha[2];
      var hora = partesFecha[3];
      var minuto = partesFecha[4];
  
      this.mes = this.mes.toString();
      this.dia = this.dia.toString();
      this.anio = this.anio.toString();
      this.horaActual = this.horaActual.toString();
      this.minutoActual = this.minutoActual.toString();
  
      if(dia === this.dia && mes === this.mes && anio === this.anio && hora === this.horaActual && minuto === this.minutoActual && text === 12 && munsac === 'miMunsac'){
        const sub = this.horarioService.getHorarioByIdUserAndDate(this.user.id, 'idUsuario', this.fechaString).subscribe((horario)=>{
          if(horario.length>0){
            sub.unsubscribe();
            var id = horario[0].payload.doc.id;
            const ahora = new Date();
            const horaActual = ahora.getHours();
            const minutoActual = ahora.getMinutes();
            const hora = horaActual+":"+minutoActual;

            const cambios: any = {
              'horario.salida': hora
            };
            this.horarioService.editHorario(id, cambios).then(
              () => {
                const dialogRef = this.dialog.open(PopupActionSuccessComponent, {
                  data: 'SALIDA',
                  maxWidth:  this.isMobile ? '90dvw' : '35vw',
                  minWidth: this.isMobile ? '90dvw' : 'auto'
                });
                this.dialogRef.close();
                dialogRef.afterClosed().subscribe(result => {
            
                });
              },
              (error: any) => {
                console.log(error);
              }
            );
          }else{
            this.toast.info('Primero debes marcar entrada');
            this.dialogRef.close();
          }
        });
      }else{
        this.toast.info('Código no válido');
        this.dialogRef.close();
      }
    }
  }

  horaExtra($subject : any) {
    if(this.escaneoRealizado === false){
      this.escaneoRealizado = true;
      var id = $subject[0].value;
      const sub = this.horaExtraService.getHoraExtraById(id).subscribe((horaExtra)=>{
        sub.unsubscribe();
        const dialogRef = this.dialog.open(PopupAddHourexComponent, {
          data:{
            horaExtra: horaExtra,
            detail: false
          },
          maxWidth:  this.isMobile ? '90dvw' : '100vw',
          minWidth: this.isMobile ? '90dvw' : 'auto'
        });
        this.dialogRef.close();
        dialogRef.afterClosed().subscribe(result => {
    
        });
      })
    }
  }

  getClient($subject: any){
    if(this.escaneoRealizado === false){
      this.escaneoRealizado = true;
      try{
        var base64 = $subject[0].value;
        var id = atob(base64);
        var partesId = id.split("/");
        var fecha = partesId[2];
        var dia = partesId[3];
        const sub = this.clientService.getIngresoByDateAndRut(fecha, dia, base64).subscribe((ingreso)=>{
          sub.unsubscribe();
          const dialogRef = this.dialog.open(PopupInfoClientComponent, {
            data:{
              accion: 'ingresar',
              datos:ingreso,
              id: id
            },
            maxWidth:  this.isMobile ? '90dvw' : '100vw',
            minWidth: this.isMobile ? '90dvw' : 'auto',
            maxHeight: this.isMobile ? '70dvh' : 'auto'
          });
          this.dialogRef.close();
          dialogRef.afterClosed().subscribe(result => {
          });
        });
      } catch (error: any){
        this.toast.info('El código no es valido',error);
        this.dialogRef.close();
      }
    }
  }

  getDataScooter($subject: any){
    if(this.escaneoRealizado === false){
      this.escaneoRealizado = true;
      try {
        var id = $subject[0].value;
        const sub = this.stService.getStById(id).subscribe((data)=>{
          sub.unsubscribe();
          const dialogRef = this.dialog.open(PopupInfoClientComponent, {
            data:{
              accion: 'revision',
              datos: data,
              id: id
            },
            maxWidth:  this.isMobile ? '90dvw' : '100vw',
            minWidth: this.isMobile ? '90dvw' : 'auto',
            maxHeight: this.isMobile ? '70dvh' : 'auto'
          });
          this.dialogRef.close();
          dialogRef.afterClosed().subscribe(result => {
          });
        });
      } catch (error: any) {
        this.toast.info('El código no es valido',error);
        this.dialogRef.close();
      }
    }
  }
}
