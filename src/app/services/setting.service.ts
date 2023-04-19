import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private firestore: AngularFirestore) { }

  getSetting(): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador').valueChanges();
  }

  editConfiguracion(setting: any): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('mimunsac-colaborador').update(setting);
  }
}
