import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(private firestore: AngularFirestore) { }

  getHorarioByIdUser(idUsuario: any, attribute: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Horarios', ref => ref.where(attribute, '==', idUsuario)).valueChanges();
  }

  generarLlegada(horario: any): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Horarios').add(horario);
  }

  generarSalida(id: string, horario: any): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Horarios').doc(id).update(horario);
  }

  getHorarioByIdUserAndDate(idUsuario: any, attribute: any, fecha: string): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Horarios', ref => ref.where(attribute, '==', idUsuario).where('fechaString', '==', fecha)).snapshotChanges();
  }
}
