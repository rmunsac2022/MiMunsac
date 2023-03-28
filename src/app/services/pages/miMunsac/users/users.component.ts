import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupUserDeleteComponent } from 'src/app/components/popup-user-delete/popup-user-delete.component';
import { PopupUserComponent } from 'src/app/components/popup-user/popup-user.component';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  toggled: boolean = false;
  emoji: any;
  listUsers: User[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    public _userService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.getUsers();
      }
    });
  }

  handleSelection(event: any) {
    this.emoji = event.char
  }

  getUsers() {
    this._userService.getUsers().subscribe((doc) => {
      doc.forEach((element: any) => {
        var user = {
          id: element.payload.doc.id,
          nombre: element.payload.doc.data().nombre,
          sistema: element.payload.doc.data().sistema,
          password: element.payload.doc.data().password,
          rut: element.payload.doc.data().rut,
          emoji: element.payload.doc.data().emoji,
          cargo: element.payload.doc.data().cargo,
          idDireccion: element.payload.doc.data().idDireccion,
          correo: element.payload.doc.data().correo,
          telefono: element.payload.doc.data().telefono,
          name: '',
          apellido: '',
        }
        var partesNombre = user.nombre.split(" ");
        var primerNombre = partesNombre[0];
        var primerApellido = partesNombre[2];

        user.name = primerNombre;
        user.apellido = primerApellido;

        this.listUsers.push(user);
      });
      this.loading = false;
    });
  }

  createUser(){
    const dialogRef = this.dialog.open(PopupUserComponent, {
      maxWidth:  "80vw",
      data: {
        list: this.listUsers,
        index: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listUsers = [];
      this.getUsers();
    });
  }

  editUser(indexList : any){
    const dialogRef = this.dialog.open(PopupUserComponent, {
      maxWidth:  "80vw",
      data: {
        list: this.listUsers,
        index: indexList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listUsers = [];
      this.getUsers();
    });
  }

  confirmDelete(indexList : any){
    const dialogRef = this.dialog.open(PopupUserDeleteComponent, {
      maxWidth:  "30dvw",
      maxHeight:  "fit-content",
      data: this.listUsers[indexList]
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listUsers = [];
      this.getUsers();
    });
  }
}
