import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RelatorioService, Relatorio } from 'src/app/servico/relatorio.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WhatsonPage } from 'src/app/whatson/whatson.page';

@Component({
  selector: 'app-allordem',
  templateUrl: './allordem.page.html',
  styleUrls: ['./allordem.page.scss'],
})
export class AllordemPage implements OnInit {
  segmentValue: 'LIDOS' | 'NÃO LIDOS' = 'NÃO LIDOS';
  allLidas: Relatorio | null | undefined = null;
  ordemServico: Relatorio[] = [];
  allOrdem: Relatorio[] = [];
  nuberOS: string = '';
  layotPage: boolean = false;  // Começa com a lista de ordens

  constructor(
    private relatServ: RelatorioService,
    private Auth: AngularFireAuth,
    private modalCtr: ModalController
  ) { }

  // Carrega as ordens de serviço no início
  async ngOnInit() {
    try {
      const user = await this.Auth.currentUser;
      if (user) {
        const userId = user.uid;
        this.ordemServico = await this.relatServ.readData03(userId);
        console.log('Ordens de serviço:', this.ordemServico);
      }
    } catch (err) {
      console.error('Erro ao carregar ordens de serviço:', err);
    }
  }

  // Lida com a mudança de segmento e atualiza o valor de `segmentValue`
  segmentChanged(event: any) {
    console.log(event);
  }

  async opemOrdenSservice(nuberOS: string) {
    console.log('Ordem selecionada:', nuberOS);
    try {
      this.allOrdem = this.ordemServico.filter(peca => peca.numeroOrdem === nuberOS);
      console.log(this.allOrdem)
      this.allLidas = this.allOrdem.find(peca => peca.lido);
      console.log('Ordem para exibição:', this.allLidas);

      if (this.allLidas) {
        this.allLidas.lido = true;  // Atualiza para "lido"
        this.endOs(this.allLidas);
        this.layotPage = !this.layotPage;
        console.log(this.layotPage)

      }
    } catch (err) {
      console.error('Erro ao abrir ordem de serviço:', err);
    }
  }

  endOs(os: Relatorio) {
    const updatedRelatorio = { ...os, lido: true };
    this.relatServ.updateData03(os.id, updatedRelatorio).then(() => {
    }).catch(err => {
      console.error('Erro ao atualizar ordem:', err);
    });
  }
      async pesquisar() {
    this.modalCtr.create({component: WhatsonPage}).then((modal) => modal.present());
     }

  fecharModal() {
    this.modalCtr.dismiss();
  }
}
