import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorasExtrasService {

  constructor(private firestore: AngularFirestore) { }

  getHoraExtra(): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('HorasExtras',ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
  }

  getHoraExtraByIdUserAndFecha(idUsuario: any, fecha: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('HorasExtras', ref => ref.where('empleados', 'array-contains', idUsuario).where('mesAnio', '==', fecha)).valueChanges();
  }

  guardarHoraExtra(hora: any): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('HorasExtras').add(hora);
  }

  editHoraExtra(id: string, hora: any): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('HorasExtras').doc(id).update(hora);
  }

  getHoraExtraByIdUser(idUsuario: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('HorasExtras', ref => ref.where('empleados', 'array-contains', idUsuario)).valueChanges();
  }

  getHoraExtraById(id: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('HorasExtras').doc(id).snapshotChanges()
      .pipe(
        map(changes => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        })
      );
  }
}
