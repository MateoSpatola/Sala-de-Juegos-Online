import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  private _firestore = inject(AngularFirestore);

  setDocument(collection: string, data: any): void {
    const document = this._firestore.collection(collection).doc();
    document.set(data);
  }

  getDocument(collection: string) {
    return this._firestore.collection(collection).valueChanges();
  }

  convertTimestampToDate(timestamp: Timestamp): string {
    return new Date(timestamp.seconds * 1000).toLocaleString('es-ES', {hour12: false});
  }

}
