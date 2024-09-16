import { CadastroprevePage } from './../preventiva/cadastropreve/cadastropreve.page';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PreventpaginaPage } from '../preventiva/preventpagina/preventpagina.page';
import { PopoverController } from '@ionic/angular';
import { RelatorioPage } from '../preventiva/relatorio/relatorio.page';

@Component({
  selector: 'app-popover-preventiva',
  templateUrl: './popover-preventiva.component.html',
  styleUrls: ['./popover-preventiva.component.scss'],
})
export class PopoverPreventivaComponent  implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}


  acaoBotao3() {
    this.popoverCtrl.dismiss();
    this.modalCtrl.create({ component: CadastroprevePage }).then((modal) => modal.present());
  }
  acaoBotao5() {
    this.popoverCtrl.dismiss();
    this.modalCtrl.create({ component: PreventpaginaPage }).then((modal) => modal.present());
  }
  acaoBotao4(){
    this.popoverCtrl.dismiss();
    this.modalCtrl.create({ component: RelatorioPage }).then((modal) => modal.present());

  }
}
