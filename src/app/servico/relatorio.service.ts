import { Injectable, EventEmitter } from '@angular/core';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc } from "firebase/firestore";
import { FirebaseService } from './firebase.service';

export interface Relatorio {
  id: string;  // Gerado pelo Firebase
  userId: string;  // ID do usuário que salvou o documento
  tipo: 'Elétrica' | 'Mecânica' | 'Eletroeletrônica' | 'Pneumática' | 'Hidráulica';
  nome: string;
  nomePreventiva: string;
  numeroOrdem: string;
  passo: string;
  instrucao: string [];
  status: 'agendado' | 'em progresso' | 'concluído';
  dataInicial: any;
  periodicidade: '01 dia'|'15 dias' | '30 dias' | '03 meses' | '06 meses' | '01 ano';
  relatorioTexto?: string;  // Adicionei esta propriedade se for necessário
  lido: boolean;
  codigoId: string;
  modoFalha:'Cabo Rompido'|'Curto Circuito'|'Tensão Elétrica irregular'|'Isolação Anormal' |'Corrente Elétrica Anormal'|'Temperatura Anormal' | 'vibração Anormal'| 'Espessura Anormal' | 'Corrosão' | 'Desajustado' | 'Desalinhado' | 'Desnivelado' | 'Sem Comunicação' | 'Falta Fase' | 'Fixação Irregular' | 'Quebrado' | 'Queimado' | 'Ressecado' | 'Rompido' | 'Sujeira';
  localInstalacao:string;
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  itemUpdated: EventEmitter<void> = new EventEmitter<void>();


  private relatorioCollection = collection(this.firebaseService.db, "relatorios");

  constructor(
    private firebaseService: FirebaseService
  ) { }
  async readData03(userId: string) {
    console.log(`Fetching documents for user ID: ${userId}`);
    const querySnapshot = await getDocs(query(this.relatorioCollection, where("userId", "==", userId)));
    console.log(`Number of documents fetched: ${querySnapshot.size}`);
    const mensagens: Relatorio[] = [];
    querySnapshot.forEach((doc) => {
      console.log(`Document ID: ${doc.id}, Data: `, doc.data());
      const { id, ...data } = doc.data() as Relatorio;
      mensagens.push({ id: doc.id, ...data });
    });
    console.log(`Returning messages: `, mensagens);
    return mensagens;
  }


  async createData03(relatorio: Omit<Relatorio, 'id'>): Promise<string> {
    // Adiciona o documento sem a propriedade 'id'
    const docRef = await addDoc(this.relatorioCollection, relatorio);
    this.itemUpdated.emit();
    return docRef.id;
  }

  async updateData03(id: string, update: Partial<Relatorio>) {
    await updateDoc(doc(this.relatorioCollection, id), update);
  }

  async deleteData03(id: string) {
    await deleteDoc(doc(this.relatorioCollection, id));
    this.itemUpdated.emit();
  }

}
