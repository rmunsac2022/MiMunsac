import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  ruta: string | undefined;

  constructor(
    public router: Router,
    private _route: ActivatedRoute,
    private auth: AuthService
  ){}

  ngOnInit(){}

  cerrarSesion(){
    this.auth.logOut();
    this.router.navigate(['/login'])
  }


}
