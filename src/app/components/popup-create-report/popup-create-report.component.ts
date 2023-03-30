import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-create-report',
  templateUrl: './popup-create-report.component.html',
  styleUrls: ['./popup-create-report.component.css']
})
export class PopupCreateReportComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupCreateReportComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
  ) { }

  ngOnInit(): void {
  }

}
