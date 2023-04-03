import { Component, Inject, OnInit,ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxScannerQrcodeService,ScannerQRCodeConfig,ScannerQRCodeResult, NgxScannerQrcodeModule, NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-popup-tick-qr',
  templateUrl: './popup-tick-qr.component.html',
  styleUrls: ['./popup-tick-qr.component.css']
})
export class PopupTickQrComponent implements OnInit {
  uObject: any;
  isContent: boolean = false;
  valuess: any;
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
    @Inject(MAT_DIALOG_DATA) 
    public data: any
    ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.ac) {
      // Inicializar el componente
      this.ac.start();
    }
  }

  resultad($subject : any) {
    console.log($subject[0].value)



  }
  


}
