import { Injectable } from '@angular/core';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  db: any;
  afAuth: AngularFireAuth;

  constructor(afAuth: AngularFireAuth) {
    const firebaseConfig = {
      // suas configurações do Firebase
    };

    if (!getApps().length) {
      // Initialize Firebase
      initializeApp(firebaseConfig);
    }
    this.db = getFirestore();
    this.afAuth = afAuth;
  }

  get authState() {
    return this.afAuth.authState;
  }
}
