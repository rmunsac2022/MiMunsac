import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { PopupShortcutsComponent } from '../popup-shortcuts/popup-shortcuts.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  accesoShortcuts: boolean = false;
  isMobile : boolean;
  listOptions: any;

  constructor(
    public router: Router,
    private _route: ActivatedRoute,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog
  ){
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(){
    this.afAuth.onAuthStateChanged((user) => {
      const sub = this.auth.getUserByEmail(user!.email, 'correo').subscribe((user)=>{
        sub.unsubscribe();
        var user = user[0];
        if(user.area == "servicioTecnico" || user.area == "postVenta"  || user.area == "ti") {
          this.accesoShortcuts = true;
        }
      });
    });
  }

  cerrarSesion(){
    this.auth.logOut();
    this.router.navigate(['/login'])
    localStorage.removeItem('permission');
  }

  moreOptions(){
    const dialogRef = this.dialog.open(PopupShortcutsComponent, {
      data: this.listOptions,
      maxWidth:  this.isMobile ? '90dvw' : '40vw',
      minWidth: this.isMobile ? '90dvw' : 'auto',
      maxHeight: this.isMobile ? '70dvh' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
