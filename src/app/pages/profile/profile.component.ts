import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';
import { PermissionRequestService } from 'src/app/services/permission-request.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = new User;
  loading: boolean = true;
  encargado: User = new User;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private firebaseError: FirebaseCodeErrorService,
    private permissionService: PermissionRequestService
  ) { }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
      if (user){
        this.permissionService.confirmPermitionsProfile();
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

      const sub2 = this.authService.getUserById(this.user.idDireccion).subscribe((encargado)=>{
        sub2.unsubscribe();
        this.encargado = encargado;
        var partesNombre = this.encargado.nombre!.split(" ");
        var primerNombre = partesNombre[0];
        var primerApellido = partesNombre[2];
        this.encargado.name = primerNombre;
        this.encargado.apellido = primerApellido;
        this.loading = false;
      });
    });
  }

  recuperarPassword(email: any) {
    this.afAuth.sendPasswordResetEmail(email).then(() => {
        this.toastr.success('Le enviamos un correo para restablecer su contraseña', 'Recuperar contraseña');
      })
      .catch((error) => {
        this.toastr.info(this.firebaseError.codeError(error.code), 'Error')
      });
  }
}
