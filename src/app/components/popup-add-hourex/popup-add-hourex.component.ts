import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-add-hourex',
  templateUrl: './popup-add-hourex.component.html',
  styleUrls: ['./popup-add-hourex.component.css']
})
export class PopupAddHourexComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupAddHourexComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
  ) { }

  ngOnInit(): void {
  }

}
