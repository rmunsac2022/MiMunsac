import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Report } from '../models/Report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private firestore: AngularFirestore) { }

  getReports(): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Reportes', ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
  }

  getReportByIdUser(idUsuario: any, attribute: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Reportes', ref => ref.where(attribute, '==', idUsuario)).valueChanges();
  }

  crearReporte(reporte: Report): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('registros').collection('Reportes').add(reporte);
  }
}
