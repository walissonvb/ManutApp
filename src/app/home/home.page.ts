import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ModalController, IonContent, IonMenu, PopoverController, ToastController } from '@ionic/angular';
import { PaginaPage } from '../almoxarife/pagina/pagina.page';
import { PaginaPage01 } from '../maquina/pagina/pagina.page';
import { PreventpaginaPage } from '../preventiva/preventpagina/preventpagina.page';
import { Maquina, MaquinaeService } from '../servico/maquinae.service';
import { AlmoxarifeService, Cliente } from '../servico/almoxarife.service';
import { FirebaseService } from '../servico/firebase.service';
import { PreventivaService, Mensagem } from '../servico/preventiva.service';
import { PopoverSuboptionsComponent } from '../popover-suboptions/popover-suboptions.component';
import { PopoverManuaisComponent } from '../popover-manuais/popover-manuais.component';
import { PopoverMaquinaComponent } from '../popover-maquina/popover-maquina.component';
import { PopoverPreventivaComponent } from '../popover-preventiva/popover-preventiva.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interfaces/user';
import { LoginService } from 'src/app/servico/login.service';
import { Router } from '@angular/router';
import { WhatsonPage } from '../whatson/whatson.page';
import { Relatorio, RelatorioService } from '../servico/relatorio.service';
import { Subscription } from 'rxjs';
import { OrdemSPage } from '../ordemServico/ordem-s/ordem-s.page';
import { AllordemPage } from '../ordemServico/allordem/allordem.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private itemUpdatedSubscription!: Subscription; // Adiciona o '!'
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonMenu) menu!: IonMenu;
  maquina: Maquina[] = [];
  cliente: Cliente[] = [];
  Mensagem: Mensagem[] = [];
  alertMessages: Mensagem[] = [];
  filteredMensagens: Mensagem[] = [];
  dados: User = {
    id: '',
    email: '',
    password: '',
  };
  retPreve: Mensagem[] = [];
  retmaq: Maquina[] = [];
  idmaquinaAtual: string[] = [];
  infoRel: Relatorio[] = [];

  constructor(
    private popoverController: PopoverController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private service: MaquinaeService,
    private firebaseService: FirebaseService,
    private serviço: AlmoxarifeService,
    private preventivaService: PreventivaService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private relatorioService: RelatorioService,
    private servicoLogin: LoginService,
  ) { }

  async ngOnInit() {
    try {
      this.itemUpdatedSubscription = this.relatorioService.itemUpdated.subscribe(() => {
        this.loadItems(); // Recarrega os itens quando o evento é emitido
      });

      this.afAuth.authState.subscribe(async (user) => {
        if (user) {
          this.loadItems(); // Carrega os itens ao logar
          this.openMaq();
          this.openInf();
          this.checkPreventivaAtrasada();
        }
      });
    } catch (error) {
      console.error('Ocorreu um erro ao inicializar:', error);
    }
  }

  async loadItems(){
    try {
      this.afAuth.authState.subscribe(async (user) => {
        if (user) {
          this.openMaq();
          this.openInf();
          this.checkPreventivaAtrasada();
        }
      });
    } catch (error) {
      console.error('Ocorreu um erro ao Reinicializar:', error);
    }
  }

  ngOnDestroy() {
    // Desinscreve do evento quando o componente for destruído
    if (this.itemUpdatedSubscription) {
      this.itemUpdatedSubscription.unsubscribe();
    }
  }

  async openMaq() {
    console.log('openMaq');
    try {
      this.afAuth.authState.subscribe(async (user) => {
        console.log(user);
        if (user) {
          const userId = user.uid;
          this.retmaq = await this.service.readData(userId);
          console.log(this.retmaq);

          // Obtenha os IDs únicos das máquinas
          const idmaquinaAtual = Array.from(new Set(this.retmaq.map(maquina => maquina.id)));
          console.log(idmaquinaAtual);

          // Array para armazenar todas as mensagens
          const allMensagens: Mensagem[] = [];

          // Itera sobre cada ID de máquina e obtém as mensagens correspondentes
          for (const maquinaId of idmaquinaAtual) {
            const mensagens = await this.preventivaService.obterMensagensPorMaquina(maquinaId);
            allMensagens.push(...mensagens);
          }

          // Filtrar mensagens para obter apenas um exemplar por ID de máquina
          const mensagensUnicas = idmaquinaAtual.map(maquinaId =>
            allMensagens.find(mensagem => mensagem.codigoId === maquinaId)
          ).filter(mensagem => mensagem !== undefined) as Mensagem[];
          // Armazene as mensagens filtradas em this.retPreve
          this.retPreve = mensagensUnicas;
          console.log(this.retPreve); // Verifique o resultado final com apenas um exemplar por máquina

        } else {
          console.log('Nenhum usuário autenticado.');
        }
      });
    } catch (error) {
      console.error('Erro ao executar openMaq:', error);
    }
  }

  async openInf() {
    this.afAuth.authState.subscribe(async (user) => {
      console.log(user);
      if (user) {
        const userId = user.uid;
        this.retmaq = await this.service.readData(userId);
        console.log(this.retmaq);

        // Obtenha os IDs únicos das máquinas
        const idmaquinaAtual = Array.from(new Set(this.retmaq.map(maquina => maquina.id)));
        console.log(idmaquinaAtual);
        if (idmaquinaAtual) {
          this.infoRel = await this.relatorioService.readData03(userId);

          if (this.infoRel.length === 0) {  // Verifique se o array está vazio
          } else {
            const allRela = Array.from(new Set(this.infoRel.map(relatorio => relatorio.codigoId !== undefined)));
            console.log(this.infoRel);
            // Continue o processamento, se necessário
          }
        } else {
          this.showSuccessToastlogout('NÃO HÁ RELATÓRIOS');
        }
      }
    })
  }



  abrirAlmoxarife() {
    this.modalCtrl.create({ component: PaginaPage }).then((modal) => modal.present());
  }

  abrirMaquina() {
    this.modalCtrl.create({ component: PaginaPage01 }).then((modal) => modal.present());
  }

  abrirPreventiva() {
    this.modalCtrl.create({ component: PreventpaginaPage }).then((modal) => modal.present());
  }

  abrirManuAuto() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLScGjIkUwisEvMLZoBmWsTMDaY39hq7JTk5SNUPOQArYT9E89g/viewform', '_blank');
  }

  async pesquisar() {
    this.modalCtrl.create({ component: WhatsonPage }).then((modal) => modal.present());
  }
  async PopoverSuboptionsComponent(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverSuboptionsComponent,
      translucent: true,
      event: event
    });
    return await popover.present();
  }
  async PopoverManuaisComponent(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverManuaisComponent,
      translucent: true,
      event: event
    });
    return await popover.present();
  }
  async PopoverMaquinaComponent(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverMaquinaComponent,
      translucent: true,
      event: event
    });
    return await popover.present();
  }
  async PopoverPreventivaComponent(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverPreventivaComponent,
      translucent: true,
      event: event
    });
    return await popover.present();
  }
  // Repita o padrão para os outros botões...

  async checkPreventivaAtrasada() {
    // Obter o userId do usuário autenticado
    const user = await this.afAuth.currentUser;
    const userId = user ? user.uid : null;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }
    // Obtenha todas as mensagens
    const mensagens = await this.preventivaService.readData02(userId);
    console.log('Mensagens:', mensagens); // Adicione um log aqui

    // Filtra as mensagens onde a terceira posição de idcompost é igual a 1
    const filteredMensagens = mensagens.filter(mensagem => mensagem.idcompost[2] === '1');
    console.log('Mensagens filtradas:', filteredMensagens); // Adicione um log aqui

    // Obtém a data atual
    const currentDate = new Date();

    // Cria um array para armazenar as mensagens de preventiva atrasada
    const preventivaAtrasada = [];

    // Percorre as mensagens filtradas
    for (const mensagem of filteredMensagens) {
      // Converte a dataInicial e a periodicidade para uma data
      const preventivaDate = new Date(mensagem.dataInicial);
      const periodicidade = this.convertPeriodicidade(mensagem.periodicidade);
      preventivaDate.setMonth(preventivaDate.getMonth() + periodicidade);

      // Se a data atual é maior que a data da preventiva, adiciona a mensagem ao array de preventiva atrasada
      if (currentDate > preventivaDate) {
        preventivaAtrasada.push(mensagem);
      }
    }

    console.log('Preventiva atrasada:', preventivaAtrasada); // Adicione um log aqui

    // Ordena as mensagens de preventiva atrasada em ordem cronológica
    preventivaAtrasada.sort((a, b) => (new Date(a.dataInicial)).getTime() - (new Date(b.dataInicial)).getTime());

    // Pega as três primeiras mensagens de preventiva atrasada
    const topThree = preventivaAtrasada.slice(0, 3);

    console.log('Top 3:', topThree); // Adicione um log aqui

    return topThree;
  }
  convertPeriodicidade(periodicidade: string) {
    let months;
    switch (periodicidade) {
      case '30 dias':
        months = 1;
        break;
      case '03 meses':
        months = 3;
        break;
      case '06 meses':
        months = 6;
        break;
      case '01 ano':
        months = 12;
        break;
      default:
        months = 0;
    }
    console.log(`Periodicidade: ${periodicidade}, Months: ${months}`); // Adicione um log aqui
    return months;
  }
  async logout() {
    try {
      await this.servicoLogin.logout();
      this.router.navigate(['/login']);
      this.showSuccessToastlogout('Até Mais Tarde!')
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      this.showErrorToastlogout('Algo deu Errado Em Sair, Confira Se Tem Internet!')
    }
  }
  async showSuccessToastlogout(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      cssClass: 'toast-container toast-success' // Adicione a classe personalizada
    });
    toast.present();
  }

  async showErrorToastlogout(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      cssClass: 'toast-container toast-error' // Adicione a classe personalizada
    });
    toast.present();
  }
  }
