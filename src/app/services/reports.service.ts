import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Report } from '../models/Report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private firestore: AngularFirestore) { }

  getReports(): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador').collection('Reportes', ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
  }

  /*getFirst10Reports(): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador').collection('Reportes', ref => ref.orderBy('fecha', 'asc').limit(10)).snapshotChanges();
  }

  getAfter10Reports(startAfterDoc: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador')
      .collection('Reportes', ref => ref.orderBy('fecha', 'asc').startAfter(startAfterDoc).limit(10))
      .snapshotChanges();
  }*/

  getReportByIdUser(idUsuario: any, attribute: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador').collection('Reportes', ref => ref.where(attribute, '==', idUsuario)).valueChanges();
  }

  crearReporte(reporte: Report): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador').collection('Reportes').add(reporte);
  }

  getReportByIdUserAndFecha(idUsuario: any, attribute: any, fecha: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador').collection('Reportes', ref => ref.where(attribute, '==', idUsuario).where('fechaString', '==', fecha)).valueChanges();
  }

  getReportByid(id: any): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador').collection('Reportes').doc(id).valueChanges();
  }
}
