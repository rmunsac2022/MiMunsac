import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-create-request',
  templateUrl: './popup-create-request.component.html',
  styleUrls: ['./popup-create-request.component.css']
})
export class PopupCreateRequestComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupCreateRequestComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
  ) { }

  ngOnInit(): void {
  }

}
