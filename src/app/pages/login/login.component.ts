import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: FormGroup;
  userLogged: any;
  rutNotFound: boolean = true;
  permitionsGranted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastrService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        if(!this.permitionsGranted){
          this.router.navigate(['/permits']);
        } else{
          this.router.navigate(['/home']);
        }
      }
    });

  }

  entrar(){
    const email = this.login.value.email;
    const password = this.login.value.password;
    this.auth.logIn(email, password);
    this.login.reset();
  }

  
}
