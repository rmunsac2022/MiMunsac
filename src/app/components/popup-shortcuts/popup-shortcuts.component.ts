import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupTickQrComponent } from '../popup-tick-qr/popup-tick-qr.component';

@Component({
  selector: 'app-popup-shortcuts',
  templateUrl: './popup-shortcuts.component.html',
  styleUrls: ['./popup-shortcuts.component.css']
})
export class PopupShortcutsComponent implements OnInit {
  isMobile : boolean;
  isPostVenta: boolean = false;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PopupShortcutsComponent>,
    private deviceService: DeviceDetectorService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { 
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    if(this.data.includes('munsacAyuda')){
      this.isPostVenta = true;
    }
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

}
