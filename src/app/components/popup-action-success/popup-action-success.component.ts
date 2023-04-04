import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-action-success',
  templateUrl: './popup-action-success.component.html',
  styleUrls: ['./popup-action-success.component.css']
})
export class PopupActionSuccessComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupActionSuccessComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { }

  ngOnInit(): void {}

}
