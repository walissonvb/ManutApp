import { Injectable } from '@angular/core';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { FirebaseService } from './firebase.service';
import { firstValueFrom } from 'rxjs';

export interface Cliente {
  id: string;
  produto: string;
  estoque: number;
  local: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlmoxarifeService {
  private clienteCollection = collection(this.firebaseService.db, "clientes");

  constructor(private firebaseService: FirebaseService) {}

  async readData01() {
    try {
      const user = await firstValueFrom(this.firebaseService.authState);

      if (!user) {
        console.log('Nenhum usuário autenticado.');
        return [];
      }

      const userId = user.uid;
      console.log(`ID do usuário autenticado: ${userId}`);

      const querySnapshot = await getDocs(query(this.clienteCollection, where('userId', '==', userId)));
      const clientes: Cliente[] = [];

      querySnapshot.forEach((doc) => {
        clientes.push({ id: doc.id, ...doc.data() } as Cliente);
      });

      console.log('Dados lidos com sucesso para o userId:', userId, clientes);
      return clientes;
    } catch (error) {
      console.error('Erro ao ler dados:', error);
      throw error;
    }
  }


  async createData01(cliente: Cliente) {
    const docRef = await addDoc(this.clienteCollection, cliente);
    return docRef.id;
  }

  async updateData01(id: string, cliente: Cliente) {
    await updateDoc(doc(this.clienteCollection, id), {...cliente});
  }

  async deleteData01(id: string) {
    await deleteDoc(doc(this.clienteCollection, id));
  }
}
