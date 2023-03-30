import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupCreateRequestComponent } from 'src/app/components/popup-create-request/popup-create-request.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  crearRequest(){
    const dialogRef = this.dialog.open(PopupCreateRequestComponent, {
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
