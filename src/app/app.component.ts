import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MiDualtron';
  isLoggedIn: boolean = false;
  
  constructor(
    private router: Router
  ){
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      if(currentRoute === '/login' || currentRoute === '/' || currentRoute === '/permits'){
        this.isLoggedIn = true;
      }else{
        this.isLoggedIn = false;
      }
    });
  }
}
