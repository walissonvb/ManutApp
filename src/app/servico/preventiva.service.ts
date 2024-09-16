import { Injectable, EventEmitter } from '@angular/core';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc, orderBy, limit } from "firebase/firestore";
import { FirebaseService } from './firebase.service';

export interface Mensagem {
  id: string;
  userId: string;
  idcompost: string[];
  codigoId: string;
  peca: string;
  nome: string;
  nomePreventiva: string;
  numeroOrdem: string;
  foto: string;
  passo: number;
  dataInicial: any;
  instrucao: string[];  // Atualize aqui para string[]
  status: 'agendado' | 'em progresso' | 'concluído';
  tipo: 'Elétrica' | 'Mecânica' | 'Eletroeletrônica' | 'Pneumática' | 'Hidráulica';
  localInstalacao: 'Acionamento' | 'Estrutura' | 'Instrumentação';
  periodicidade: '30 dias' | '03 meses' | '06 meses' | '01 ano';
  modoFalha:'Cabo Rompido'|'Curto Circuito'|'Tensão Elétrica irregular'|'Isolação Anormal' |'Corrente Elétrica Anormal'|'Temperatura Anormal' | 'vibração Anormal'| 'Espessura Anormal' | 'Corrosão' | 'Desajustado' | 'Desalinhado' | 'Desnivelado' | 'Sem Comunicação' | 'Falta Fase' | 'Fixação Irregular' | 'Quebrado' | 'Queimado' | 'Ressecado' | 'Rompido' | 'Sujeira';
}

@Injectable({
  providedIn: 'root'
})
export class PreventivaService {
  itemUpdated: EventEmitter<void> = new EventEmitter<void>();

  private mensagemCollection = collection(this.firebaseService.db, "mensagens");

  constructor(private firebaseService: FirebaseService) { }

  async obterMensagemPrev(maquinaId: string) {
    const querySnapshot = await getDocs(query(this.mensagemCollection, where("codigoId", "==", maquinaId)));
    const mensagens: Mensagem[] = [];
    querySnapshot.forEach((doc) => {
      const { id, ...data } = doc.data() as Mensagem;
      mensagens.push({ id: doc.id, ...data });
      this.itemUpdated.emit()
    });
    return mensagens;
  }

  async obterMensagensPorMaquina(maquinaId: string): Promise<Mensagem[]> {
    const q = query(this.mensagemCollection, where('codigoId', '==', maquinaId));
    const querySnapshot = await getDocs(q);
    this.itemUpdated.emit()
    return querySnapshot.docs.map(doc => doc.data() as Mensagem);
  }

  async readData02(userId: string) {
    const querySnapshot = await getDocs(query(this.mensagemCollection, where("userId", "==", userId)));
    const mensagens: Mensagem[] = [];
    querySnapshot.forEach((doc) => {
      const { id, ...data } = doc.data() as Mensagem;
      mensagens.push({ id: doc.id, ...data });
    });
    return mensagens;
  }

  async createData02(mensagem: Mensagem) {
    const newDoc = {
      userId: mensagem.userId,
      idcompost: mensagem.idcompost,
      tipo: mensagem.tipo,
      nome: mensagem.nome,
      nomePreventiva: mensagem.nomePreventiva,
      foto: mensagem.foto,
      passo: mensagem.passo,
      instrucao: mensagem.instrucao,
      status: mensagem.status,
      dataInicial: mensagem.dataInicial,
      periodicidade: mensagem.periodicidade
    };

    const docRef = await addDoc(this.mensagemCollection, newDoc);
    this.itemUpdated.emit()
    return docRef.id;
  }

  async updateData02(id: string, mensagem: Mensagem) {
    await updateDoc(doc(this.mensagemCollection, id), { ...mensagem });
  }

  async deleteData02(id: string) {
    await deleteDoc(doc(this.mensagemCollection, id));
    this.itemUpdated.emit()
  }


  async updateAll(idcomposto: string, newMensagem: Mensagem) {
    const querySnapshot = await getDocs(query(this.mensagemCollection, where("idcompost", "==", idcomposto)));
    querySnapshot.forEach((doc) => {
      this.updateData02(doc.id, newMensagem);
    });
  }

  async createDataWithSequence(mensagem: Mensagem, sequenceNumber: number, maquinaId: string) {
    const arvorepecaWithSequence = {
      ...mensagem,
      codigoId: maquinaId, // Agora codigoId é apenas o id da máquina
      passo: sequenceNumber // Novo campo para numeração hierárquica
    };

    // Verifique se instrucao é um array e converta cada item para string
    if (Array.isArray(arvorepecaWithSequence.instrucao)) {
      arvorepecaWithSequence.instrucao = arvorepecaWithSequence.instrucao.map(item => item.toString());
    } else {
      console.log('precisa de converte no esle')
      // Se não for um array, converta-o para um array contendo uma string
    }

    console.log(arvorepecaWithSequence);

    const docRef = await addDoc(this.mensagemCollection, arvorepecaWithSequence);
    this.itemUpdated.emit()
    return docRef.id;
  }


  async getNextSequenceNumber(): Promise<number> {
    const q = query(this.mensagemCollection, orderBy('passo', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return 1;
    } else {
      const lastDoc = querySnapshot.docs[0].data() as Mensagem;
      this.itemUpdated.emit()
      return lastDoc.passo + 1;
    }
  }

  }
