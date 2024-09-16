import { Injectable, Inject } from '@angular/core';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc
} from 'firebase/firestore';

export interface Arvorepeca {
  id: string;
  maquina: string;
  nome: string;
  tipo: 'Elétrica' | 'Mecânica' | 'Eletroeletrônica' | 'Pneumática' | 'Hidráulica' ;
  localInstalacao: 'Acionamento' | 'Estrutura' | 'Instrumentação';
  inspecao: 'Sensitiva' | 'Temperatura' | 'Vibração' | 'Espessura' | 'Calibração' | 'Corrente Eletrica' | 'Isolação Elétrica' | 'Nível';
  codigoId: string;
  arvore: number;
  codigoFabricante: string;
  dimensoes: string;
  userId: string;
}

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
export class ArvorepecaService {
  private arvorepecaCollection: any;
  private maquinaCollection: any;

  constructor(@Inject('db') private db: any) {
    this.arvorepecaCollection = collection(this.db, 'arvorepecas');
    this.maquinaCollection = collection(this.db, 'maquinas');
  }

  async createData(arvorepeca: Arvorepeca) {
    const docRef = await addDoc(this.arvorepecaCollection, arvorepeca);
    return docRef.id;
  }

async readData(userId: string): Promise<Arvorepeca[]> {
  const querySnapshot = await getDocs(
    query(this.arvorepecaCollection, where('userId', '==', userId))
  );

  const arvorepecas: Arvorepeca[] = [];
  querySnapshot.forEach((doc) => {
    const { id, ...data } = doc.data() as Arvorepeca;
    arvorepecas.push({ id: doc.id, ...data });
  });

  return arvorepecas;
}



  async updateData(id: string, arvorepeca: Arvorepeca) {
    await updateDoc(doc(this.arvorepecaCollection, id), { ...arvorepeca });
  }

  async removeData(id: any) {
    await deleteDoc(doc(this.arvorepecaCollection, id));
  }

  async createDataWithSequence(arvorepeca: Arvorepeca, sequenceNumber: number, maquinaId: string) {
    const arvorepecaWithSequence = {
      ...arvorepeca,
      codigoId: maquinaId, // Agora codigoId é apenas o id da máquina
      arvore: sequenceNumber // Novo campo para numeração hierárquica
    };
    const docRef = await addDoc(this.arvorepecaCollection, arvorepecaWithSequence);
    return docRef.id;
  }

  async getMaquinaDetails(maquinaId: string) {
    const maquinaDoc = await getDoc(doc(this.maquinaCollection, maquinaId));
    if (maquinaDoc.exists()) {
      return { id: maquinaDoc.id, ...maquinaDoc.data() } as Maquina;
    } else {
      return null;
    }
  }

  async getNextSequenceNumber() {
    const arvorepecasSnapshot = await getDocs(this.arvorepecaCollection);
    return arvorepecasSnapshot.size + 1;
  }

  async readArvorePecaByMaquinaId(userId: string, codigoId: string): Promise<Arvorepeca[]> {
    console.log('UserId:', userId);
    console.log('CodigoId:', codigoId);

    // A busca agora é feita diretamente pelo codigoId, que é o id da máquina
    const q = query(this.arvorepecaCollection, where('userId', '==', userId), where('codigoId', '==', codigoId));
    const querySnapshot = await getDocs(q);

    console.log('Número de documentos encontrados:', querySnapshot.size);

    const arvorepecas: Arvorepeca[] = [];
    querySnapshot.forEach((doc) => {
      console.log('Documento encontrado:', doc.data());
      const { id, ...data } = doc.data() as Arvorepeca;
      arvorepecas.push({ id: doc.id, ...data });
    });

    if (arvorepecas.length === 0) {
      console.log('Nenhum documento correspondente encontrado.');
    }

    return arvorepecas;
  }
  }
