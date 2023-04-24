import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupTickQrComponent } from 'src/app/components/popup-tick-qr/popup-tick-qr.component';

@Component({
  selector: 'app-scanner-qr-client',
  templateUrl: './scanner-qr-client.component.html',
  styleUrls: ['./scanner-qr-client.component.css']
})
export class ScannerQrClientComponent implements OnInit {
  isMobile : boolean;

  constructor(
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog,
  ) { 
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {}

  scanner(){
    const dialogRef = this.dialog.open(PopupTickQrComponent, {
      data: 'client',
      maxWidth:  this.isMobile ? '90dvw' : '40vw',
      minWidth: this.isMobile ? '90dvw' : 'auto',
      maxHeight: this.isMobile ? '70dvh' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
