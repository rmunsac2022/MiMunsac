import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private firestore: AngularFirestore) { }

  getRequests(): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros')
    .collection('Solicitudes',ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
  }

  editRequest(id: string, request: any): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Solicitudes').doc(id).update(request);
  }
}
