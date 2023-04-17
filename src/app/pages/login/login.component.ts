import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
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
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if(user){
        this.router.navigate(['/permits'])
        let audio = new Audio();
        audio.src = "./assets/audio/beep.mp3";
        audio.load();
        audio.play();
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
