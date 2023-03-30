import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { User } from '../models/User';
import { FirebaseCodeErrorService } from './firebase-code-error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private toastr: ToastrService,
    public router: Router,
    private firebaseError: FirebaseCodeErrorService
  ) { }

  getUserByEmail(email: any, attribute: any): Observable<any> {
    return this.firestore.collection('PersonalMunsac', ref => ref.where(attribute, '==', email)).valueChanges();
  }

  getUserById(id: any): Observable<any> {
    return this.firestore.collection('PersonalMunsac').doc(id).valueChanges();
  }

  addUser(user: User): Promise<any> {
    return this.firestore.collection('PersonalMunsac').add(user);
  }

  getUsers(): Observable<any> {
    return this.firestore
      .collection('PersonalMunsac', (ref) => ref.orderBy('nombre', 'asc'))
      .snapshotChanges();
  }

  guardarUser(user: User): Promise<any> {
    return this.firestore.collection('PersonalMunsac').add(user);
  }

  editarUser(id: string, user: any): Promise<any> {
    return this.firestore.collection('PersonalMunsac').doc(id).update(user);
  }

  deleteUser(id: string): Promise<any> {
    return this.firestore.collection('PersonalMunsac').doc(id).delete();
  }

  logOut() {
    this.toastr.info('Ha salido exitosamente', 'Sesion cerrada');
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }

  logIn(email: any, password: any) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          let audio = new Audio();
          audio.src = "../../../assets/audio/beep.mp3";
          audio.load();
          audio.play();
          this.router.navigate(['/splash']);
          this.toastr.info('Ha ingresado exitosamente', 'Bienvenido');
        }
      })
      .catch((error) => {
        this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
      });
  }
}
