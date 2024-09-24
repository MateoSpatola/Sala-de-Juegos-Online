import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  private _firestore = inject(AngularFirestore);

  setDocument(collection: string, data: any) {
    const document = this._firestore.collection(collection).doc();
    document.set(data);
  }



}
