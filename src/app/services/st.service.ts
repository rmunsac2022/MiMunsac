import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StService {

  constructor(private firestore: AngularFirestore) { }

  getStById(id: any): Observable<any>{
    return this.firestore.collection('IngresosST').doc(id).valueChanges();
  }

  updateScheduleSt(id: string, doc: any): Promise<any>{
    return this.firestore.collection('IngresosST').doc(id).update(doc);
  }

  countDocuments(): Observable<any[]> {
    return this.firestore.collection('IngresosST').valueChanges();
  }
}
