import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Maquina, MaquinaeService } from 'src/app/servico/maquinae.service';
import { PreventivaService, Mensagem } from 'src/app/servico/preventiva.service';
import { WhatsonPage } from 'src/app/whatson/whatson.page';
import { Arvorepeca, ArvorepecaService } from 'src/app/servico/arvorepeca.service';
import * as moment from 'moment';
import { RelatorioService, Relatorio } from 'src/app/servico/relatorio.service';


@Component({
  selector: 'app-ordem-s',
  templateUrl: './ordem-s.page.html',
  styleUrls: ['./ordem-s.page.scss'],
})
export class OrdemSPage implements OnInit {
  custompecaOptions = {
    header: 'Peças',
    subHeader: '',
    message: 'Escolha em qual peça sera parte da preventiva',
    translucent: true,
  };
  customperiodicidadeOptions = {
    header: 'Periodicidade',
    subHeader: '',
    message: 'Escolha em qual período deve acontecer a manutenção',
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

  mensagemForm: FormGroup;
  arvorepecas: Arvorepeca[] = [];
  maquinas: Maquina[] = [];
  mensagensDaMaquina: Mensagem[] = [];
  selectedArvorepeca: Arvorepeca | null = null;
  idMaquina: string;
  nomemaq: string;
  instrucao: string[] = [];
  mensInstrucao: string[] = [];
  objetpreve: Mensagem = {
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
  firtchec: boolean = true;
  selectedMachineName: string = '';
  filterPEcas: Maquina[] = [];
  novoComentario = '';
  machineName: string = '';
  modoFalhaOptions: string[] = [];
  mensagemFalha = {
    modoFalhaE: ['Corrente Elétrica Anormal', 'Isolação Anormal', 'Tensão Elétrica irregular', 'Curto Circuito', 'Cabo Rompido', 'Sem Comunicação', 'Falta Fase', 'Temperatura Anormal', 'Corrosão', 'Desajustado', 'Fixação Irregular', 'Quebrado', 'Queimado', 'Ressecado', 'Rompido', 'Sujeira'],
    modoFalhaM: ['Temperatura Anormal', 'Vibração Anormal', 'Espessura Anormal', 'Corrosão', 'Desajustado', 'Desalinhado', 'Desnivelado', 'Sem Comunicação', 'Falta Fase', 'Fixação Irregular', 'Quebrado', 'Queimado', 'Ressecado', 'Rompido', 'Sujeira', 'Vazamento', 'Vedação Corroída', 'Furado']
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
    private servicorel: RelatorioService,

  ) {
    this.mensagemForm = this.fb.group({
      numeroOrdem: [moment().format('YYYY-MM-DDTHH:mm:ssZ'), Validators.required],
      localInstalacao: ['', Validators.required],
      tipo: ['', Validators.required],
      modoFalha: ['', Validators.required],
      periodicidade: ['', Validators.required],
      nome: ['', Validators.required],
      foto: ['', Validators.required],
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
        console.log(userId)
        this.maquinas = await this.service.readData(userId);
        console.log(this.maquinas)

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


  async firtchecOUT(idMaquina: string, machineName: string) {
    console.log(idMaquina, machineName)
    this.firtchec = false;
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        console.log(userId)
        const filterPEcas = await this.arvore.readData(userId);
        console.log(filterPEcas)
        this.arvorepecas = filterPEcas.filter(peca => peca.codigoId === idMaquina);
        console.log('Árvore de Peças filtrada:', this.arvorepecas);

        this.selectedMachineName = machineName;
        this.idMaquina = idMaquina;
        this.machineName = machineName;

      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  async gerarRelatorio() {

    try {
      const user = await this.afAuth.currentUser;
      const userId = user ? user.uid : 'N/A';
      const relatorio: Omit<Relatorio, 'id'> = {
        userId,
        codigoId: this.idMaquina,
        modoFalha: this.mensagemForm.value.modoFalha,
        tipo: this.mensagemForm.value.tipo,
        nome: this.mensagemForm.value.nome,
        numeroOrdem: this.mensagemForm.value.numeroOrdem,
        instrucao: this.mensagemForm.value.instrucao,
        nomePreventiva: this.machineName,
        localInstalacao: this.mensagemForm.value.localInstalacao,
        passo: '',
        status: this.objetpreve.status,
        dataInicial: moment().format('YYYY-MM-DDTHH:mm'),
        periodicidade: this.mensagemForm.value.periodicidade,
        lido: false,
      };


      console.log(relatorio['relatorioTexto']);

      const relatorioId = await this.servicorel.createData03(relatorio);
      console.log('Relatório salvo com ID:', relatorioId);
      this.fecharModal()

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
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
