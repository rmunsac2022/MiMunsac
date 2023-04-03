import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxScannerQrcodeService,ScannerQRCodeConfig,ScannerQRCodeResult  } from 'ngx-scanner-qrcode';
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

  public config: ScannerQRCodeConfig = {
    // fps: 100,
    // isBeep: false,
    // decode: 'macintosh',
    // deviceActive: 1,
    constraints: { 
      audio: false,
      video: {
        width: '10px'
      }
    } 
  };
  constructor(
    public dialogRef: MatDialogRef<PopupTickQrComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    ) {}

  ngOnInit(): void {
    console.log(this.qrCodeResult);
  }

  resultad($subject : any) {
    console.log($subject[0].value)
  }
  


}
