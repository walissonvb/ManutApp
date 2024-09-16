import { User } from './../../interfaces/user';
import { FirebaseService } from './../../servico/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlmoxarifeService, Cliente } from 'src/app/servico/almoxarife.service';
import { ModalPage } from '../modal/modal.page';
import { AlertController } from '@ionic/angular';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WhatsonPage } from 'src/app/whatson/whatson.page';


interface Resultado {
  produto: string;
  estoque: number;
  local: string;
  idUser: string;
}


@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.page.html',
  styleUrls: ['./pagina.page.scss'],
})
export class PaginaPage implements OnInit {
  cliente!: Cliente[];
  dados: User = {
    id: '',
    email: '',
    password: '',
  };


  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private serviço: AlmoxarifeService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private firebaseService: FirebaseService // injeta o serviço FirebaseService
  ) { }

  async ngOnInit() {
    try {
      // Carregar os dados do serviço de forma assíncrona
      const response = await this.serviço.readData01();
      this.cliente = response;

      // Agora, esperar pelo estado de autenticação assíncrono
      const user = await firstValueFrom(this.afAuth.authState);

      if (user) {
        const userId = user.uid;
        console.log(`ID do usuário autenticado: ${userId}`);
        this.showSuccessToast('ID do usuário autenticado com sucesso!')
        // Agora você pode usar o userId para associar dados específicos do usuário.
      } else {
        console.log('Nenhum usuário autenticado.');
        this.showErrorToast('Nenhum usuário autenticado!')
      }
    } catch (error) {
      console.error('Erro durante a inicialização: ', error);
      this.showErrorToast('Erro durante a inicialização!')
    }
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async showErrorToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  remover(id: any) {
    this.serviço.deleteData01(id).then(() => this.remover);
    this.serviço.readData01().then((response) => {
      this.cliente = response;
      this.showSuccessToast('O item foi apagado com sucesso')
    });
  }

  novoProduto() {
    this.modalCtrl
      .create({
        component: ModalPage,
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then(({ data }) => {
        //console.log(data);
        this.serviço.readData01().then((response) => {
          this.cliente = response;
        });
        this.showSuccessToast('Produto cadastrado com sucesso')
      });
  }

  atualizar(c: Cliente) {
    this.modalCtrl
      .create({
        component: ModalPage,
        componentProps: { c },
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then(({ data }) => {
        //console.log(data);
        this.serviço.readData01().then((response) => {
          this.cliente = response;
        });
        this.showSuccessToast('Produto atualizado com sucesso')

      });
  }

  async subtrairQuantidade(c: Cliente) {
    c.estoque -= 1;
    this.serviço.updateData01(c.id, c).then(() => { });
    if (c.estoque === 5) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message:
          'O ' +
          c.produto +
          ' atingiu o valor mínimo. Avise aos responsaveis .',
        buttons: ['Fechar'],
      });
      await alert.present();
      this.serviço.readData01().then((response) => {
        this.cliente = response;
      });
    }
  }


  async pesquisar() {
    this.modalCtrl.create({ component: WhatsonPage }).then((modal) => modal.present());
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }
}

