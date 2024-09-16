import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PreventivaService, Mensagem } from 'src/app/servico/preventiva.service';
import { PreventmodalPage } from '../preventmodal/preventmodal.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { WhatsonPage } from 'src/app/whatson/whatson.page';
import { MaquinaeService, Maquina } from 'src/app/servico/maquinae.service';

@Component({
  selector: 'app-cadastropreve',
  templateUrl: './cadastropreve.page.html',
  styleUrls: ['./cadastropreve.page.scss'],
})
export class CadastroprevePage implements OnInit {
  maquinaFilter: Maquina[] = [];
  idSelecionado: string | null = null;
  mensagensDaMaquina: Mensagem[] = [];
  preventFormachine: Mensagem[] = [];
  exibirFormulario: boolean = true;
  idmaquinaAtual: string | null = null;
  objetpreve: Mensagem = {
    id: '',
    userId: '',
    codigoId: '',
    peca: '',
    idcompost: ['', '', '', '', ''],
    tipo: 'Elétrica',
    nome: '',
    nomePreventiva: '',
    numeroOrdem: '',
    localInstalacao: 'Acionamento',
    foto: '',
    passo: 1,
    instrucao: [],
    status: 'agendado',
    dataInicial: null,
    periodicidade: '30 dias',
    modoFalha: 'Sujeira',
  };
  mensagemData: Mensagem[] = [];
  mensagensFiltradas: Mensagem[] = [];
  currentIndex = 0;
  mensagensFiltradasPorTipo: { [key: string]: Mensagem[] } = {};
  objectKeys = Object.keys;

  constructor(
    private navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private preventivaService: PreventivaService,
    private servicomaquina: MaquinaeService
  ) {}

  async ngOnInit() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        this.maquinaFilter = await this.servicomaquina.readData(userId);
        console.log(this.maquinaFilter);
      }
    } catch (erro) {
      console.log('Erro ao buscar dados da máquina:', erro);
    }
  }

  getColor(status: string) {
    switch (status) {
      case 'agendado':
        return 'warning';
      case 'em progresso':
        return 'danger';
      case 'concluído':
        return 'success';
      default:
        return 'medium';
    }
  }

  async openPrev(idmaquinaAtual: string) {
    console.log('ID da máquina atual:', idmaquinaAtual);

    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;

        // Obtenção dos dados de mensagem
        this.mensagemData = await this.preventivaService.readData02(userId);
        console.log('Dados de mensagemData:', this.mensagemData);

        // Filtra as mensagens que correspondem à máquina atual
        const mensagensFiltradas = this.mensagemData.filter(
          mensagem => mensagem.idcompost[0] === idmaquinaAtual
        );

        console.log('Mensagens filtradas:', mensagensFiltradas);

        // Agrupa as mensagens por tipo e mantém apenas um exemplar de cada tipo
        this.mensagensFiltradasPorTipo = mensagensFiltradas.reduce((acc, mensagem) => {
          const tipo = mensagem.tipo;
          if (!acc[tipo]) {
            acc[tipo] = [mensagem]; // Armazena o primeiro exemplar de cada tipo
          }
          return acc;
        }, {} as { [key: string]: Mensagem[] });

        console.log('Mensagens agrupadas por tipo (apenas um exemplar):', this.mensagensFiltradasPorTipo);

        if (Object.keys(this.mensagensFiltradasPorTipo).length === 0) {
          console.error('Nenhuma mensagem correspondente foi encontrada.');
          this.showErrorToast('NÃO EXISTE PREVENTIVAS CADASTRADAS');
        }
      } else {
        console.error('ID da Máquina não foi encontrado nos parâmetros');
      }
    } catch (error) {
      console.error('Erro ao executar openPrev:', error);
    }

    this.exibirFormulario = false;
    console.log('Exibir formulário:', this.exibirFormulario);
  }

  async opemPrevAction(objetpreve: Mensagem) {
    console.log(objetpreve);
    try {
      const modal = await this.modalCtrl.create({
        component: PreventmodalPage,
        componentProps: {
          'objetpreve': objetpreve
        }
      });

      modal.present();
      await modal.onDidDismiss();
    } catch (error) {
      console.error('Erro ao abrir o modal:', error);
    }
  }

  async deletPrev(idSelecionado: any) {
    console.log(idSelecionado);

    try {
      console.log('ID recebido para exclusão:', idSelecionado);

      if (!idSelecionado) {
        throw new Error('ID inválido');
      }

      const user = await this.afAuth.currentUser;
      const userId = user ? user.uid : null;

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      await this.preventivaService.deleteData02(idSelecionado);
      const response = await this.preventivaService.readData02(userId);
      this.mensagensDaMaquina = response;
    } catch (error) {
      console.error('Erro ao deletar ou ler dados:', error);
    }
  }

  async pesquisar() {
    this.modalCtrl.create({ component: WhatsonPage }).then((modal) => modal.present());
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

  fecharModalexibicao() {
    this.modalCtrl.dismiss();
  }
}
