import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private firestore: AngularFirestore) { }

  getIngresoByDateAndRut(fecha: any, dia: any, id: any): Observable<any>{
    return this.firestore.collection('MunsacControl').doc('munsac-ayuda').collection('Agenda').doc(fecha).snapshotChanges()
    .pipe(map(snapshot => {
      const data = snapshot.payload.data();
      if (data) {
        const elemento = data[dia].find((obj: any) => obj.idUnico === id);
        return elemento;
      } else {
        return null;
      }
    }));
  }

  saveIngresoSt(ingresoSt: any): Promise<any> {
    return this.firestore.collection('IngresosST').add(ingresoSt);
  }
}
