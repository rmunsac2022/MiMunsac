import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupAddHourexComponent } from 'src/app/components/popup-add-hourex/popup-add-hourex.component';

@Component({
  selector: 'app-hours-extra',
  templateUrl: './hours-extra.component.html',
  styleUrls: ['./hours-extra.component.css']
})
export class HoursExtraComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  addHoraExtra(){
    const dialogRef = this.dialog.open(PopupAddHourexComponent, {
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
