import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Maquina, MaquinaeService } from 'src/app/servico/maquinae.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { ArvorepecaPage } from '../arvorepeca/arvorepeca.page'; // Importe ArvorepecaPage
import { WhatsonPage } from 'src/app/whatson/whatson.page';

@Component({
  selector: 'app-modal-01',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() c?: Maquina;
  atualizar = false;
  dados: Maquina = {
    id: '',
    nome: '',
    manual: '',
    classificacao: 'A | B | C',
    userId: ''
  };

  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private serviço: MaquinaeService,
    private afAuth: AngularFireAuth,
  ) { }

  async ngOnInit() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.dados.userId = user.uid;
      if (this.c && this.c.userId === user.uid) {
        this.atualizar = true;
        this.dados = { ...this.c };
      } else if (this.c) {
        this.atualizar = true;
        this.dados = this.c;
      }
    }
  }

  enviando(form: NgForm) {
    if (form.valid) {
      const Maquina = form.value;
      Maquina.userId = this.dados.userId;
      try {
        if (this.atualizar) {
          if (this.c && this.c.id) {
            this.serviço.updateData(this.c.id, Maquina).then(() => {
              this.showSuccessToast('Cliente atualizado com sucesso!');
              this.modalCtrl.dismiss();
            });
          }
        } else {
          this.serviço.createData(Maquina).then(() => {
            this.showSuccessToast('Ativo criado com sucesso!');
            this.modalCtrl.dismiss();
          });
        }
      } catch (error) {
        console.error('Erro ao salvar os dados:', error);
        this.showErrorToast('Erro ao salvar os dados. Por favor, tente novamente.');
      }
    } else {
      this.showErrorToast('Por favor, preencha todos os campos obrigatórios.');
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
  async pesquisar() {
    this.modalCtrl.create({component: WhatsonPage}).then((modal) => modal.present());
     }
  fecharModal() {
    this.modalCtrl.dismiss();
  }

}
