import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private firestore: AngularFirestore) { }

  getSetting(): Observable<any> {
    return this.firestore.collection('MunsacControl').doc('registros').valueChanges();
  }

  editConfiguracion(setting: any): Promise<any> {
    return this.firestore.collection('MunsacControl').doc('registros').update(setting);
  }
}
