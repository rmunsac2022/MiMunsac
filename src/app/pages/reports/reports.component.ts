import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupCreateReportComponent } from 'src/app/components/popup-create-report/popup-create-report.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  crearReporte(){
    const dialogRef = this.dialog.open(PopupCreateReportComponent, {
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
