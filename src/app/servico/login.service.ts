
// login.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(public afAuth: AngularFireAuth) { }

  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      return userCredential.user ? userCredential.user.uid : null;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  async register(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return userCredential.user ? userCredential.user.uid : null;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  }
  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }
}
