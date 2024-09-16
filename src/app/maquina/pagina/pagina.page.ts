import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Maquina, MaquinaeService } from 'src/app/servico/maquinae.service';
import { ModalPage } from '../modal/modal.page';
import { ArvorepecaService } from 'src/app/servico/arvorepeca.service'; // Importando o serviço Arvorepeca
import { WhatsonPage } from 'src/app/whatson/whatson.page';

export interface Arvorepeca {
  id: string;
  maquina: string;
  localInstalacao: string;
  nome: string;
  codigoId: string;
  codigoFabricante: string;
  dimensoes: string;
  userId: string;
}

@Component({
  selector: 'app-pagina01',
  templateUrl: './pagina.page.html',
  styleUrls: ['./pagina.page.scss'],
})
export class PaginaPage01 implements OnInit {
  selectedMaquinaNome!: string;
  maquina!: Maquina[];
  showForm = true;

  constructor(
    private popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private service: MaquinaeService,
    private modalCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private servico: ArvorepecaService // Injetando o serviço Arvorepeca
  ) {}

  async ngOnInit() {
    try {
      const user = await this.afAuth.currentUser;

      if (user) {
        const userId = user.uid;
        console.log(`ID do usuário autenticado: ${userId}`);
        this.showSuccessToast('ID do usuário autenticado com sucesso!');

        this.maquina = await this.service.readData(userId);
      } else {
        console.log('Nenhum usuário autenticado.');
        this.showErrorToast('Nenhum usuário autenticado!');
      }
    } catch (error) {
      console.error('Erro durante a inicialização: ', error);
      this.showErrorToast('Erro durante a inicialização!');
    }
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async showErrorToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  remover(id: any) {
    this.service.removeData(id).then(async () => {
      const user = await this.afAuth.currentUser;
      if (user) {
        this.maquina = await this.service.readData(user.uid);
      }
    });
  }

  async abrirModal() {
    const user = await this.afAuth.currentUser;
    const idpeca = await this.servico;
    if (user) {
      const modal = await this.modalCtrl.create({
        component: ModalPage,
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data) {
        this.maquina = await this.service.readData(user.uid);
      }
    }
  }

  async atualizar(c: Maquina) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const modal = await this.modalCtrl.create({
        component: ModalPage,
        componentProps: { c },
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data) {
        this.maquina = await this.service.readData(user.uid);
      }
    }
  }

  async openListPeca(maquinaId: string) {
    try {
        // Verifica se o usuário está autenticado
        const user = await this.afAuth.currentUser;
        if (!user) {
            this.showErrorToast('Usuário não autenticado.');
            return;
        }
        // Obtém o userId do usuário autenticado
        const userId = user.uid;
        console.log('Chamando readArvorePecaByMaquinaId com maquinaId:', maquinaId);
        const arvorePecas = await this.servico.readArvorePecaByMaquinaId(userId, maquinaId);
        console.log('Dados recebidos de readArvorePecaByMaquinaId:', arvorePecas);
        if (arvorePecas && arvorePecas.length > 0) {
            // Fecha o modal antes de navegar
            await this.modalCtrl.dismiss();
            // Passa os dados relacionados para a página de listagem
            this.navCtrl.navigateForward(['/maquina/listpeca'], {
                queryParams: {
                    data: JSON.stringify(arvorePecas),
                    maquinaId: maquinaId,
                },
            });
        } else {
            this.showErrorToast('Nenhum dado correspondente encontrado.');
        }
    } catch (error) {
        console.error('Erro ao obter os dados:', error);
        this.showErrorToast('Erro ao obter os dados.');
    }
  }
  async pesquisar() {
    this.modalCtrl.create({component: WhatsonPage}).then((modal) => modal.present());
     }
  fecharModal() {
    this.modalCtrl.dismiss();
  }
}
