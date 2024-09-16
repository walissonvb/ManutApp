import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Maquina, MaquinaeService } from 'src/app/servico/maquinae.service';
import { PreventivaService, Mensagem } from 'src/app/servico/preventiva.service';
import { WhatsonPage } from 'src/app/whatson/whatson.page';
import { Arvorepeca, ArvorepecaService } from 'src/app/servico/arvorepeca.service';
import * as moment from 'moment';


@Component({
  selector: 'app-modalformprev',
  templateUrl: './modalformprev.page.html',
  styleUrls: ['./modalformprev.page.scss'],
})
export class ModalformprevPage implements OnInit {
  custompecaOptions = {
    header: 'Peças',
    subHeader: '',
    message: 'Escolha em qual peça sera parte da preventiva',
    translucent: true,
  };
  customperiodicidadeOptions = {
    header: 'Periodicidade',
    subHeader: '',
    message: 'Escolha em qual período a essa preventiva deve se repetir',
    translucent: true,
  };
  customliOptions = {
    header: 'Local Instalacao',
    subHeader: '',
    message: 'Escolha o local pra orientar o colaborador',
    translucent: true,
  };
  customTipoOptions = {
    header: 'Tipo',
    subHeader: '',
    message: 'Escolha o tipo de equipamento o colaborador fará a preventiva',
    translucent: true,
  };
  customFalhaOptions = {
    header: 'Modo de Falhas',
    subHeader: '',
    message: 'Escolha mais de um potencial modo de falha pode ocorrer',
    translucent: true,
  };
  mensagemFalha = {
    modoFalhaE: ['Corrente Elétrica Anormal', 'Isolação Anormal', 'Tensão Elétrica irregular', 'Curto Circuito', 'Cabo Rompido', 'Sem Comunicação', 'Falta Fase', 'Temperatura Anormal', 'Corrosão', 'Desajustado', 'Fixação Irregular', 'Quebrado', 'Queimado', 'Ressecado', 'Rompido', 'Sujeira'],
    modoFalhaM: ['Temperatura Anormal', 'Vibração Anormal', 'Espessura Anormal', 'Corrosão', 'Desajustado', 'Desalinhado', 'Desnivelado', 'Sem Comunicação', 'Falta Fase', 'Fixação Irregular', 'Quebrado', 'Queimado', 'Ressecado', 'Rompido', 'Sujeira', 'Vazamento', 'Vedação Corroída', 'Furado']
  };

  modoFalhaOptions: string[] = [];
  mensagemForm: FormGroup;
  arvorepecas: Arvorepeca[] = [];
  maquinas: Maquina[] = [];
  mensagensDaMaquina: Mensagem[] = [];
  selectedArvorepeca: Arvorepeca | null = null;
  idMaquina: string;
  nomemaq: string;
  instrucao: string[] = [];
  mensInstrucao: string[] = [];
  mensagem: Mensagem = {
    id: '',
    idcompost: [],
    codigoId: '',
    peca: '',
    tipo: 'Elétrica',
    nome: '',
    nomePreventiva: '',
    numeroOrdem: '',
    localInstalacao: 'Acionamento',
    foto: '',
    passo: 1,
    instrucao: [],
    status: 'agendado',
    dataInicial: '',
    periodicidade: '01 ano',
    modoFalha: 'Sujeira',
    userId: ''
  };

  constructor(
    private arvore: ArvorepecaService,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private service: MaquinaeService,
    private preventivaService: PreventivaService,
    private navParams: NavParams,
  ) {
    this.mensagemForm = this.fb.group({
      nomePreventiva: ['', Validators.required],
      localInstalacao: ['', Validators.required],
      tipo: ['', Validators.required],
      modoFalha: ['', Validators.required],
      status: ['', Validators.required],
      dataInicial: [moment().format('YYYY-MM-DDTHH:mm:ssZ'), Validators.required], periodicidade: ['', Validators.required],
      nome: ['', Validators.required],
      foto: ['', Validators.required],
      passo: [1, Validators.required],
      instrucao: ['', Validators.required],
      selectedArvorepeca: ['', Validators.required],
    });
    this.idMaquina = this.navParams.get('idMaquina');
    this.nomemaq = '';
  }

  async ngOnInit() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        const allpeca = await this.service.readData(userId);
        this.maquinas = allpeca.filter(maq => maq.id === this.idMaquina);
        this.getNameMachine(this.idMaquina);

        const allMensagens = await this.preventivaService.obterMensagensPorMaquina(this.idMaquina);
        this.mensagensDaMaquina = allMensagens.filter(mensagem => mensagem.idcompost[0] === this.idMaquina);
        console.log('Mensagens da Máquina carregadas no formulário:', this.mensagensDaMaquina);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  async onTipoChange(event: any) {
    console.log('event', event)
    if (event === 'Elétrica' || event === 'Eletroeletrônica') {
      this.modoFalhaOptions = this.mensagemFalha.modoFalhaE;
      console.log(this.modoFalhaOptions)

    } else {
      this.modoFalhaOptions = this.mensagemFalha.modoFalhaM;
      console.log(this.modoFalhaOptions)

    }

  }
  async pecasPlace(event: any) {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        const allpeca = await this.arvore.readData(userId);
        this.arvorepecas = allpeca.filter(maq => maq.localInstalacao === event);
        console.log(this.arvorepecas)
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }

  }

  async loadArvorepecas() {
    this.afAuth.currentUser.then(async user => {
      if (user) {
        const userId = user.uid;
        this.arvorepecas = await this.arvore.readData(userId);
      }
    });
  }

  async getNameMachine(idMaquina: string): Promise<string> {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        const maquinas = await this.service.readData(userId);
        const maquina = maquinas.find(m => m.id === idMaquina);
        console.log(maquina);
        return maquina ? maquina.nome : '';
      }
    } catch (error) {
      console.error('Erro ao buscar nome da máquina:', error);
    }
    return '';
  }

  async onCreate() {
    if (this.mensagemForm.valid) {
      const mensagem: Mensagem = { ...this.mensagemForm.value, userId: 'userId' };

      if (this.idMaquina) {
        try {

          const nomeMaquina = await this.getNameMachine(this.idMaquina);
          const sequenceNumber = await this.preventivaService.getNextSequenceNumber();
          this.mensagemForm.patchValue({ passo: sequenceNumber });
          const idcompost = [
            this.idMaquina,
            nomeMaquina,
            this.mensagemForm.value.nomePreventiva,
            this.mensagemForm.value.tipo,
            this.mensagemForm.value.passo.toString()
          ];

          // Certifique-se de que ambos os valores são strings
          const instrucao = [
            this.mensagemForm.value.instrucao,
            this.mensagemForm.value.modoFalha
          ].map(item => item.toString());

          const user = await this.afAuth.currentUser;
          if (!user) {
            this.showErrorToast('Erro: Nenhum usuário autenticado.');
            return;
          }
          const userId = user.uid;

          const mensagemComInstrucao = { ...mensagem, idcompost, instrucao, userId };

          console.log(instrucao); // Verifique a saída aqui para garantir que está correta

          const mensagemId = await this.preventivaService.createDataWithSequence(mensagemComInstrucao, sequenceNumber, this.idMaquina);
          this.showSuccessToast('Mensagem criada com sucesso!');
          this.clearCamp()
        } catch (error) {
          console.error('Erro ao salvar os dados:', error);
          this.showErrorToast('Erro ao salvar os dados. Por favor, tente novamente.');
        }
      } else {
        this.showErrorToast('Erro: ID da máquina selecionada é nulo.');
      }
    } else {
      this.showErrorToast('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  async clearCamp() {
    try {
      this.mensagemForm.reset({
        ...this.mensagemForm.value,
        instrucao: '',
        passo: this.mensagemForm.value.passo + 1 // Incrementa o passo para a próxima utilização
      });
    } catch (error) {
      console.log('Erro ao limpar os campos:', error);
    }
  }

  onArvorepecaChange(event: any) {
    const selectedValue = event.detail.value;
    this.selectedArvorepeca = this.arvorepecas.find(arvorepeca => arvorepeca === selectedValue) || null;
    if (this.selectedArvorepeca) {
      this.mensagemForm.patchValue({
        nome: this.selectedArvorepeca.nome,
        inspecao: this.selectedArvorepeca.inspecao,
      });
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
    const modal = await this.modalCtrl.create({
      component: WhatsonPage
    });
    await modal.present();
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }
}
