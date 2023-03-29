import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  uObject: any;
  isContent: boolean = false;
  registrarUser: FormGroup;
  cambioBoton: boolean = false;
  isOpened: boolean = false;
  message: string = '';
  emoji: any;
  listUser: User[] = [];
  index: any

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _userService: AuthService,
    private firebaseError: FirebaseCodeErrorService,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { 

    this.registrarUser = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', Validators.required],
      cargo: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      emoji: ['', Validators.required],
      idDireccion: ['', Validators.required],
      password: ['', Validators.required],
      sistema: ['']
    });
  }

  ngOnInit(): void {
    
    
  }

}
