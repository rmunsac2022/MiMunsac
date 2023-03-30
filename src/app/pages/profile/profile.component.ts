import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = new User;
  loading: boolean = true;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
      this.getUser(user!.email)
    });
  }

  getUser(email: any){
    const sub = this.authService.getUserByEmail(email, 'correo').subscribe((user)=> {
      sub.unsubscribe();
      this.user = user[0];
      var partesNombre = this.user.nombre!.split(" ");
      var primerNombre = partesNombre[0];
      var primerApellido = partesNombre[2];
      this.user.name = primerNombre;
      this.user.apellido = primerApellido;
      console.log(this.user);
      this.loading = false;
    });
  }
}
