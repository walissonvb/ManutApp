import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MaquinaeService, Maquina } from 'src/app/servico/maquinae.service';
import { ModalformprevPage } from '../modalformprev/modalformprev.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WhatsonPage } from 'src/app/whatson/whatson.page';
import { PreventivaService, Mensagem } from 'src/app/servico/preventiva.service';

@Component({
  selector: 'app-preventpagina',
  templateUrl: './preventpagina.page.html',
  styleUrls: ['./preventpagina.page.scss'],
})
export class PreventpaginaPage implements OnInit {
  maquina: Maquina[] = [];
  mensagensDaMaquina: Mensagem[] = [];
  idSelecionado: string | null = null;
  maquinaId: string = ''; // Inicialize como uma string vazia
  dataSelecionada: string = ''; // Variável para armazenar a data selecionada

  constructor(
    private afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private service: MaquinaeService,
    private serviprev: PreventivaService,
  ) {
    // Inicialização da dataSelecionada no construtor
    this.dataSelecionada = new Date().toISOString();
  }

  obterDataAtualFormatada(): string {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  async ngOnInit() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        this.maquina = await this.service.readData(user.uid);
        if (this.maquina.length > 0) {
          this.maquinaId = this.maquina[0].id;
          console.log('ID da Máquina:', this.maquinaId);
          this.mensagensDaMaquina = await this.serviprev.obterMensagensPorMaquina(this.maquinaId);
          console.log('Mensagens da Máquina carregadas:', this.mensagensDaMaquina);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  async creatnewprevet(maquina: Maquina) {
    try {
      console.log('Máquina recebida:', maquina);
      const idMaquina = maquina.id;
      console.log('ID da Máquina:', idMaquina);

      // Passar apenas o idMaquina para o formulário
      this.abrirFormulario(idMaquina);

    } catch (error) {
      console.error('Erro ao verificar informações da máquina:', error);
    }
  }

  async abrirFormulario(idMaquina: string) {
    const modal = await this.modalCtrl.create({
      component: ModalformprevPage,
      componentProps: {
        idMaquina: idMaquina
      }
    });
    await modal.present();
    return modal.onDidDismiss();
  }  async pesquisar() {
    this.modalCtrl.create({ component: WhatsonPage }).then((modal) => modal.present());
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }
}
