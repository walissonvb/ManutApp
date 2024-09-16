import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Arvorepeca, ArvorepecaService } from 'src/app/servico/arvorepeca.service';
import { Maquina, MaquinaeService } from 'src/app/servico/maquinae.service';
import { WhatsonPage } from 'src/app/whatson/whatson.page';

@Component({
  selector: 'app-arvorepeca',
  templateUrl: './arvorepeca.page.html',
  styleUrls: ['./arvorepeca.page.scss'],
})
export class ArvorepecaPage implements OnInit {
  form: FormGroup;
  selectedMaquinaId!: string;
  selectedMaquinaNome!: string;
  maquina!: Maquina[];
  showForm = true;
  selectedArvcodId!: string;

  @Input() c?: Arvorepeca;
  atualizar = false;
  dados: Arvorepeca = {
    id: '',
    maquina: '',
    nome: '',
    tipo: 'Elétrica',
    localInstalacao: 'Acionamento',
    inspecao: 'Sensitiva',
    codigoId: '',
    arvore: 0,
    codigoFabricante: '',
    dimensoes: '',
    userId: ''
  };

  constructor(
    private fb: FormBuilder,
    private service: MaquinaeService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private servico: ArvorepecaService
  ) {
    this.form = this.fb.group({
      maquina: [{ value: '', disabled: true }],
      tipo: ['Elétrica', Validators.required],
      localInstalacao: ['Acionamento', Validators.required],
      nome: ['', Validators.required],
      arvore: [{ value: '', disabled: true }],
      codigoFabricante: ['', Validators.required],
      dimensoes: ['', Validators.required],
      inspecao: ['Sensitiva', Validators.required]
    });
  }

  async ngOnInit() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.dados.userId = user.uid;
      if (this.c && this.c.userId === user.uid) {
        this.atualizar = true;
        this.dados = { ...this.c };
        this.populateForm();
      }
    }

    this.maquina = await this.service.readData(this.dados.userId);
  }

  private populateForm() {
    this.form.patchValue({
      maquina: this.dados.maquina,
      tipo: this.dados.tipo,
      localInstalacao: this.dados.localInstalacao,
      nome: this.dados.nome,
      arvore: this.dados.arvore,
      codigoFabricante: this.dados.codigoFabricante,
      dimensoes: this.dados.dimensoes,
      inspecao: this.dados.inspecao
    });
  }

  async enviando() {
    if (this.form.valid) {
      const arvorepeca = { ...this.form.value, userId: this.dados.userId, codigoId: this.selectedMaquinaId };

      try {
        if (this.atualizar) {
          if (this.c && this.c.id) {
            await this.servico.updateData(this.c.id, arvorepeca);
            this.showSuccessToast('Cliente atualizado com sucesso!');
            this.modalCtrl.dismiss();
          }
        } else {
          const sequenceNumber = await this.servico.getNextSequenceNumber();
          arvorepeca.arvore = sequenceNumber;
          await this.servico.createDataWithSequence(arvorepeca, sequenceNumber, this.selectedMaquinaId);
          this.showSuccessToast('Ativo criado com sucesso!');
          this.modalCtrl.dismiss();
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

  toggleForm(maquinaId: string, maquinaNome: string) {
    console.log('Máquina clicada:', maquinaId, maquinaNome);
    this.selectedMaquinaNome = maquinaNome;
    this.selectedMaquinaId = maquinaId; // Certificando que selectedMaquinaId é atualizado
    this.dados.maquina = maquinaNome;

    this.servico.getMaquinaDetails(maquinaId).then(maquina => {
      if (maquina) {
        this.form.controls['maquina'].setValue(maquina.nome);
      } else {
        console.log('Detalhes da máquina não encontrados para', maquinaId);
      }
    }).catch(error => {
      console.error('Erro ao buscar detalhes da máquina:', error);
    });

    this.servico.readArvorePecaByMaquinaId(this.dados.userId, maquinaId).then(arvorepecas => {
      let novaNumeracao = 1;
      if (arvorepecas && arvorepecas.length > 0) {
        const maxArvore = Math.max(...arvorepecas.map(ap => ap.arvore));
        novaNumeracao = maxArvore + 1;
      }
      this.form.controls['arvore'].setValue(novaNumeracao);
      this.dados.arvore = novaNumeracao;
      console.log('Numeração definida para:', novaNumeracao);
    }).catch(error => {
      console.error('Erro ao buscar documentos:', error);
    });

    this.showForm = !this.showForm;
  }

  async pesquisar() {
    this.modalCtrl.create({ component: WhatsonPage }).then((modal) => modal.present());
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }
}
