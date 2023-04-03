import { Component, Inject, OnInit,ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxScannerQrcodeService,ScannerQRCodeConfig,ScannerQRCodeResult, NgxScannerQrcodeModule, NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { BehaviorSubject } from 'rxjs';
import { HoraExtra } from 'src/app/models/HoraExtra';
import { HorariosService } from 'src/app/services/horarios.service';
import { HorasExtrasService } from 'src/app/services/horas-extras.service';
import { PopupAddHourexComponent } from '../popup-add-hourex/popup-add-hourex.component';
import { Horario } from 'src/app/models/Horario';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { idToken } from '@angular/fire/auth';
import { PopupActionSuccessComponent } from '../popup-action-success/popup-action-success.component';

@Component({
  selector: 'app-popup-tick-qr',
  templateUrl: './popup-tick-qr.component.html',
  styleUrls: ['./popup-tick-qr.component.css']
})
export class PopupTickQrComponent implements OnInit {
  uObject: any;
  isContent: boolean = false;
  valuess: any;
  valorQr: any;
  hora: string = '';
  mes: number | undefined;
  dia: number | undefined;
  anio: number | undefined;
  fechaString: string = '';
  user: any;
  escaneoRealizado: boolean = false;
  horaExtraObj: HoraExtra = new HoraExtra;
  public qrCodeResult: NgxScannerQrcodeService[] = [];
  $subject: BehaviorSubject<ScannerQRCodeResult[]> = new BehaviorSubject<ScannerQRCodeResult[]>([]);
  @ViewChild('ac', { static: false }) ac?: NgxScannerQrcodeComponent;


  public config: ScannerQRCodeConfig = {
    deviceActive: 1,
    isBeep: false,
    constraints: { 
      audio: false,
    } 
  };
  constructor(
    public dialogRef: MatDialogRef<PopupTickQrComponent>,
    private dialog: MatDialog,
    private horaExtraService: HorasExtrasService,
    private horarioService: HorariosService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) 
    public data: any
    ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      this.getUser(user!.email)
    });
    this.valorQr = this.data;
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();
    this.hora = horaActual+":"+minutoActual;

    this.mes = new Date().getMonth();
    this.dia = new Date().getDate();
    this.anio = new Date().getFullYear();
    this.fechaString = this.dia+"."+(this.mes+1)+"."+this.anio;
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
      this.ac.start();
    }
  }

  entrada($subject : any) {
    //Todo: Validar que el id escaneada sea valida y despues ejecutar el siguiente código
    if (!this.escaneoRealizado){
      this.escaneoRealizado = true;
      const ahora = new Date();
      const horaActual = ahora.getHours();
      const minutoActual = ahora.getMinutes();
      const hora = horaActual+":"+minutoActual;

      const LLEGADA: Horario = {
        fecha: new Date(),
        fechaString: this.fechaString,
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
            data: ''
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
  }
  
  salida($subject : any) {
    if (!this.escaneoRealizado){
      this.escaneoRealizado = true;
      const sub = this.horarioService.getHorarioByIdUserAndDate(this.user.id, 'idUsuario', this.fechaString).subscribe((horario)=>{
        sub.unsubscribe();
        var id = horario[0].payload.doc.id;
        const ahora = new Date();
        const horaActual = ahora.getHours();
        const minutoActual = ahora.getMinutes();
        const hora = horaActual+":"+minutoActual;
    
        const cambios: any = {
          'horario.salida': hora
        };
        this.horarioService.generarSalida(id, cambios).then(
          () => {
            const dialogRef = this.dialog.open(PopupActionSuccessComponent, {
              data: ''
            });
            this.dialogRef.close();
            dialogRef.afterClosed().subscribe(result => {
        
            });
          },
          (error: any) => {
            console.log(error);
          }
        );
      });
    }
  }

  horaExtra($subject : any) {
    var id = $subject[0].value;
    const sub = this.horaExtraService.getHoraExtraById(id).subscribe((horaExtra)=>{
      sub.unsubscribe();
      const dialogRef = this.dialog.open(PopupAddHourexComponent, {
        data: horaExtra
      });
      this.dialogRef.close();
      dialogRef.afterClosed().subscribe(result => {
  
      });
    })
  }

}
