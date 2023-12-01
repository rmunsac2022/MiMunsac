import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupTickQrComponent } from '../popup-tick-qr/popup-tick-qr.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { PopupClientsByFolioComponent } from '../popup-clients-by-folio/popup-clients-by-folio.component';

@Component({
  selector: 'app-popup-shortcuts',
  templateUrl: './popup-shortcuts.component.html',
  styleUrls: ['./popup-shortcuts.component.css']
})
export class PopupShortcutsComponent implements OnInit {
  isMobile : boolean;
  isPostVenta: boolean = false;
  isServicioTecnico: boolean = false;
  isVendedor: boolean = false;
  isMarketing: boolean = false;
  isTI: boolean = false;
  loading: boolean = true;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PopupShortcutsComponent>,
    private deviceService: DeviceDetectorService,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { 
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      const sub = this.auth.getUserByEmail(user!.email, 'correo').subscribe((user)=>{
        sub.unsubscribe();

        var user = user[0];
        if(user.area == "postVenta") {
          this.isPostVenta = true;
        }
        if(user.area == "servicioTecnico") {
          this.isServicioTecnico = true;
        }
        if(user.area == "marketing") {
          this.isMarketing = true;
        }
        if(user.area == "ti") {
          this.isTI = true;
        }
        if(user.area == "ventas") {
          this.isVendedor = true;
        }
        this.loading = false;
      });
    });
  }

  scannerSt(){
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'client',
      maxWidth:  this.isMobile ? '90dvw' : '40vw',
      minWidth: this.isMobile ? '90dvw' : 'auto',
      maxHeight: this.isMobile ? '70dvh' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  searchScooter(){
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'scooter',
      maxWidth:  this.isMobile ? '90dvw' : '40vw',
      minWidth: this.isMobile ? '90dvw' : 'auto',
      maxHeight: this.isMobile ? '70dvh' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  viewClients(){
    const dialogRef = this.dialog.open(PopupClientsByFolioComponent, {
      maxWidth:  this.isMobile ? '90dvw' : '50vw',
      minWidth: this.isMobile ? '90dvw' : '50vw',
      maxHeight: this.isMobile ? '70dvh' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

}
