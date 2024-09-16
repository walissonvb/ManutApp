import { Maquina } from './../../servico/arvorepeca.service';
import { MaquinaeService } from './../../servico/maquinae.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PreventivaService, Mensagem } from 'src/app/servico/preventiva.service';
import { NavParams } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RelatorioService, Relatorio } from 'src/app/servico/relatorio.service';
import { WhatsonPage } from 'src/app/whatson/whatson.page';

@Component({
  selector: 'app-preventmodal',
  templateUrl: './preventmodal.page.html',
  styleUrls: ['./preventmodal.page.scss'],
})
export class PreventmodalPage implements OnInit {
  idmaquinaAtual: string;
  maquina: Maquina[] = [];
  comentarios: string[] = [];
  objetpreve: Mensagem = {
    id: '',
    userId: '',
    codigoId: '',
    peca: '',
    idcompost: ['', '', '', '', ''],
    tipo: 'Elétrica',
    nome: '',
    nomePreventiva: '',
    numeroOrdem:'',
    localInstalacao: 'Acionamento',
    foto: '',
    passo: 1,
    instrucao: [],
    status: 'agendado',
    dataInicial: null,
    periodicidade: '30 dias',
    modoFalha: 'Sujeira',

  };
  menorIdcompost: Mensagem | null = null;
  exibirCampoComentario = false;
  novoComentario = '';
  mensagemData: Mensagem[] = [];
  mensagensFiltradas: Mensagem[] = [];
  currentIndex = 0;
  exibirFormulario: boolean = false;
  codigoid = '';


  constructor(
    private servicorel: RelatorioService,
    private afAuth: AngularFireAuth,
    public modalCtrl: ModalController,
    private servico: PreventivaService,
    private navParams: NavParams,
    private preventivaService: PreventivaService,
    private servicomaquina: MaquinaeService,
  ) {
    this.idmaquinaAtual = '';
  }

  async ngOnInit() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;

        // Tenta obter os dados da mensagem
        this.mensagemData = await this.preventivaService.readData02(userId);
        console.log('Dados de mensagem:', this.mensagemData);

        // Verifica se os dados foram obtidos corretamente
        if (!this.mensagemData || this.mensagemData.length === 0) {
          throw new Error('Nenhum dado foi retornado da função readData02.');
        }

        // Obtém o objeto passado via NavParams
        this.objetpreve = this.navParams.get('objetpreve'); // Corrigido para pegar 'objetpreve' e não 'cogigoId'

        if (this.objetpreve && this.objetpreve.codigoId) {
          this.idmaquinaAtual = this.objetpreve.codigoId;
          console.log('ID da máquina atual:', this.idmaquinaAtual);

          this.mensagensFiltradas = this.mensagemData
            .filter(mensagem =>
              mensagem.idcompost[0] === this.idmaquinaAtual &&
              mensagem.nomePreventiva === this.objetpreve.nomePreventiva // Comparação correta
            )
            .sort((a, b) => Number(a.idcompost[4]) - Number(b.idcompost[4]));

          console.log('Mensagens filtradas:', this.mensagensFiltradas);

          if (this.mensagensFiltradas.length > 0) {
            this.objetpreve = this.mensagensFiltradas[this.currentIndex];
            console.log('Objeto preventivo atual:', this.objetpreve);
          } else {
            console.error('Nenhuma mensagem correspondente foi encontrada.');
          }
        } else {
          console.error('Erro: objetpreve ou codigoId não foi encontrado.');
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar os dados:', error);
    }
  }


  abrirFormulario() {
    this.exibirFormulario = true;
  }

  adicionarComentario() {
    this.exibirCampoComentario = true;
  }

  async atualizarMensagem() {
    console.log('atualizar')
    try {
      // A mensagem já foi atualizada pelo ngModel
      console.log(this.objetpreve);
      // Chame o serviço updateData02 aqui
      await this.servico.updateData02(this.objetpreve.id, this.objetpreve);
      await this.modalCtrl.dismiss();
      this.abrirFormulario()
    } catch (error) {
      console.error(error);
    }
  }

  salvarComentario() {
    console.log('Comentário salvo:', this.novoComentario);
    this.exibirCampoComentario = false; // Esconda o campo após salvar
  }

  async nextItem() {
    console.log('next')
    if (this.currentIndex < this.mensagensFiltradas.length - 1) {
      this.currentIndex++;
      this.objetpreve = this.mensagensFiltradas[this.currentIndex];
      console.log('next', this.currentIndex)

    } else {
      await this.gerarRelatorio();
      this.fecharModal();
    }
  }

  previousItem() {
    console.log('prev')
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.objetpreve = this.mensagensFiltradas[this.currentIndex];
      console.log('prev', this.currentIndex)

    }
  }

  async fecharModal() {
    const topModal = await this.modalCtrl.getTop();
    if (topModal) {
      await this.modalCtrl.dismiss();
      this.ngOnInit();
    }
  }
  async pesquisar() {
    this.modalCtrl.create({ component: WhatsonPage }).then((modal) => modal.present());
  }

  async gerarRelatorio() {
    try {
      const user = await this.afAuth.currentUser;
      const userId = user ? user.uid : 'N/A';
      const dataAtual = new Date().toLocaleString();
      const periodicidade = this.objetpreve.periodicidade;
      const passosInstrucoes = this.mensagensFiltradas.
        map(m => `${m.passo || ''} || Conforme as instruçoes: ${m.instrucao || ''}|| Foram verificado os itens: ${m.modoFalha || ''}`).join('\n\n');
      const comentarios = this.novoComentario; // Comentários separados por quebras de linha
      const relatorioTexto = `Relatório Preventivo\n\nData: ${dataAtual}\n\nPassos/Instruções:\n\n${passosInstrucoes}\n\nComentários:\n\n${comentarios}`;
      const relatorio: Omit<Relatorio, 'id'> = {
        userId,
        codigoId: this.objetpreve.codigoId,
        modoFalha: this.objetpreve.modoFalha,
        tipo: this.objetpreve.tipo,
        nome: this.objetpreve.nome,
        numeroOrdem: this.objetpreve.numeroOrdem,
        instrucao: Array.isArray(this.objetpreve.instrucao) ? this.objetpreve.instrucao : [this.objetpreve.instrucao],
        nomePreventiva: this.objetpreve.nomePreventiva,
        passo: this.objetpreve.passo.toString(),
        status: this.objetpreve.status,
        dataInicial: this.objetpreve.dataInicial,
        periodicidade: this.objetpreve.periodicidade,
        relatorioTexto: relatorioTexto,
        localInstalacao:'',
        lido: false,
      };


      console.log(relatorio['relatorioTexto']);

      // Salvar o relatório na coleção "relatorios"
      const relatorioId = await this.servicorel.createData03(relatorio);
      console.log('Relatório salvo com ID:', relatorioId);

      // Opcional: exibir uma notificação ou feedback ao usuário
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  }
}
