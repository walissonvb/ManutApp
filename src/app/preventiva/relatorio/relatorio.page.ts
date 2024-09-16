import { Component, OnInit } from '@angular/core';
import { RelatorioService, Relatorio } from 'src/app/servico/relatorio.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ModalController } from '@ionic/angular';
import { WhatsonPage } from 'src/app/whatson/whatson.page';


@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.page.html',
  styleUrls: ['./relatorio.page.scss'],
})
export class RelatorioPage implements OnInit {
  segmentValue: 'LIDOS' | 'NÃO LIDOS' = 'NÃO LIDOS'; // Adicione esta linha
  selectedRelatorio: Relatorio | null = null;
  showForm = true;
  relatoriopreve: Relatorio[] = [];

  constructor(
    private modalCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private servicorel: RelatorioService
  ) {}

  async ngOnInit() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        console.log(`ID do usuário autenticado: ${userId}`);
        this.relatoriopreve = await this.servicorel.readData03(user.uid);
        console.log(`Dados recuperados: ${this.relatoriopreve}`);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  opemRelato(id: string) {
    console.log(id);
    this.selectedRelatorio = this.relatoriopreve.find(r => r.id === id) || null;
    console.log(this.selectedRelatorio);
    this.showForm = !this.showForm;

    // Atualize a propriedade "lido" para true
    if (this.selectedRelatorio) {
      this.selectedRelatorio.lido = true;
      // Chame o método para atualizar no Firebase
      this.atualizarRelatorio(this.selectedRelatorio);
    }
  }

  async atualizarRelatorio(relatorio: Relatorio) {
    try {
      await this.servicorel.updateData03(relatorio.id, relatorio);
      console.log('Relatório atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
    }
  }


  async deleteRelat(id: string) {
    console.log(id);
    this.servicorel.deleteData03(id).then(() => this.deleteRelat);
    this.fecharModal();
  }

  chander() {
    this.showForm = !this.showForm; // Corrigi o nome da função
  }
  async pesquisar() {
    this.modalCtrl.create({component: WhatsonPage}).then((modal) => modal.present());
     }

  fecharModal() {
    this.modalCtrl.dismiss();
  }
}
