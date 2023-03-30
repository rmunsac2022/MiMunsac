import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-tick-qr',
  templateUrl: './popup-tick-qr.component.html',
  styleUrls: ['./popup-tick-qr.component.css']
})
export class PopupTickQrComponent implements OnInit {
  uObject: any;
  isContent: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PopupTickQrComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    ) {
    if(data!=null) {
      this.uObject = data;
      this.isContent = true;
    } 
  }

  ngOnInit(): void {
  }

}
