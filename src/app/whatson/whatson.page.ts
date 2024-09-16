import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlmoxarifeService, Cliente } from '../servico/almoxarife.service';
import { ArvorepecaService } from '../servico/arvorepeca.service';
import { Maquina, MaquinaeService } from '../servico/maquinae.service';
import { PreventivaService, Mensagem } from '../servico/preventiva.service';
import { RelatorioService } from '../servico/relatorio.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface Relatorio {
  id: string;  // Gerado pelo Firebase
  userId: string;  // ID do usuário que salvou o documento
  tipo: 'eletrica' | 'mecanica';
  nome: string;
  nomePreventiva: string;
  passo: string;
  instrucao: string;
  status: 'agendado' | 'em progresso' | 'concluído';
  dataInicial: any;
  periodicidade: '30 dias' | '03 meses' | '06 meses' | '01 ano';
  relatorioTexto?: string;  // Adicionei esta propriedade se for necessário
  lido: boolean;
}
export interface Arvorepeca {
  id: string;
  maquina: string;
  localInstalacao: string;
  nome: string;
  codigoId: string;
  arvore: number;
  codigoFabricante: string;
  dimensoes: string;
  userId: string;
}

@Component({
  selector: 'app-whatson',
  templateUrl: './whatson.page.html',
  styleUrls: ['./whatson.page.scss'],
})
export class WhatsonPage implements OnInit {
  maquina: Maquina[] = [];
  cliente: Cliente[] = [];
  Mensagem: Mensagem[] = [];
  relatorio: Relatorio[] = [];
  filteredMensagens: Mensagem[] = [];
  filteredMaquinas: Maquina[] = [];
  filteredClientes: Cliente[] = [];
  filterRelatorio: Relatorio[] = [];
  searchTerm: string = '';

  constructor(
    private modalCtrl: ModalController,
    private almaserv: AlmoxarifeService,
    private arvoserv: ArvorepecaService,
    private maqserv: MaquinaeService,
    private prevserv: PreventivaService,
    private relaserv: RelatorioService,
    private afAuth: AngularFireAuth
  ) { }

  async ngOnInit() {
    try {
      this.afAuth.authState.subscribe(async (user) => {
        if (user) {
          const userId = user.uid;
          console.log(`ID do usuário autenticado: ${userId}`);
          this.Mensagem = await this.prevserv.readData02(userId);
          this.maquina = await this.maqserv.readData(userId);
          this.cliente = await this.almaserv.readData01();
        } else {
          console.log('Nenhum usuário autenticado.');
        }
      });
    } catch (error) {
      console.error('Ocorreu um erro ao inicializar:', error);
    }
  }

  filterData() {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredMensagens = this.Mensagem.filter(mensagem =>
      mensagem.nome.toLowerCase().includes(searchTermLower) ||
      mensagem.tipo.toLowerCase().includes(searchTermLower)
    );

    this.filteredMaquinas = this.maquina.filter(maquina =>
      maquina.nome.toLowerCase().includes(searchTermLower)
    );

    this.filteredClientes = this.cliente.filter(cliente =>
      cliente.produto.toLowerCase().includes(searchTermLower)
    );
    this.filterRelatorio = this.relatorio.filter(relatorio =>
      relatorio.nomePreventiva.toLowerCase().includes(searchTermLower)
    );
  }
  fecharModal() {
    this.modalCtrl.dismiss();
  }
}
