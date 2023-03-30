import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private firestore: AngularFirestore) { }

  getReports(): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Reportes', ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
  }
}
