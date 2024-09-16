import { AlmoxarifeService } from './../../servico/almoxarife.service';
import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from 'src/app/servico/almoxarife.service';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { FirebaseService } from 'src/app/servico/firebase.service';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/interfaces/user';
import { ToastController } from '@ionic/angular';
import { WhatsonPage } from 'src/app/whatson/whatson.page';

interface Resultado {
  produto: string;
  estoque: number;
  local: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() c?: Cliente;
  atualizar = false;
  resultados: Resultado[] = [];
  dadosUser: User = {
    id: '',
    email: '',
    password: '',
  };

  dados: Cliente = {
    id: '',
    produto: '',
    estoque: 0,
    local: '',
    userId: '',
  };

  constructor(
    private afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private serviço: AlmoxarifeService,
    private firebaseService: FirebaseService, // injeta o serviço FirebaseService
    private toastCtrl: ToastController,
  ) {}


  async ngOnInit() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.dados.userId = user.uid;
      if (this.c && this.c.userId === user.uid) {
        this.atualizar = true;
        this.dados = {...this.c};
      }
    }
  }

  async enviando(form: NgForm) {
    if (form.valid) {
      const cliente = form.value;
      cliente.userId = this.dados.userId;
      try {
        if (this.atualizar) {
          if (this.c && this.c.id) {
            await this.serviço.updateData01(this.c.id, cliente);
            this.showSuccessToast('Cliente atualizado com sucesso!');
          }
        } else {
          await this.serviço.createData01(cliente);
          this.showSuccessToast('Cliente criado com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao salvar os dados:', error);
        this.showErrorToast('Erro ao salvar os dados. Por favor, tente novamente.');
      }
    } else {
      this.showErrorToast('Por favor, preencha todos os campos obrigatórios.');
    }
    this.modalCtrl.dismiss();
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

  async pesquisar() {
    this.modalCtrl.create({component: WhatsonPage}).then((modal) => modal.present());
     }

  fecharModal() {
    this.modalCtrl.dismiss();
  }
}
