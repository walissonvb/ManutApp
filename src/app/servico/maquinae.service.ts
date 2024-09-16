import { Injectable, Inject } from '@angular/core';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  startAfter,
  limit
} from 'firebase/firestore';
import { where } from 'firebase/firestore';

export interface Maquina {
  id: string;
  nome: string;
  manual: string;
  classificacao: 'A | B | C';
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class MaquinaeService {
  private maquinaCollection: any;
  private lastItem: any;

  maquinaNome: string = ''; // Adicione esta linha
  maquinaId: string = ''; // Inicialize a propriedade aqui

  constructor(@Inject('db') private db: any) {
    this.maquinaCollection = collection(this.db, 'maquinas');
    this.lastItem = null;
  }

  async createData(maquina: Maquina) {
    const docRef = await addDoc(this.maquinaCollection, maquina);
    return docRef.id;
  }

  async readData(userId: string) {
    const querySnapshot = await getDocs(query(this.maquinaCollection, where("userId", "==", userId)));
    const maquinas: Maquina[] = [];
    querySnapshot.forEach((doc) => {
      const { id, ...data } = doc.data() as Maquina;
      maquinas.push({ id: doc.id, ...data });
      this.lastItem = doc;
    });
    return maquinas;
  }


  async updateData(id: string, maquina: Maquina) {
    await updateDoc(doc(this.maquinaCollection, id), { ...maquina });
  }

  async removeData(id: any) {
    await deleteDoc(doc(this.maquinaCollection, id));
  }

}
