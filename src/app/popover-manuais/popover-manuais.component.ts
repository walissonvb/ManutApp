import { Component, OnInit } from '@angular/core';
import { ModalController,  } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AllordemPage } from '../ordemServico/allordem/allordem.page';
import { OrdemSPage } from '../ordemServico/ordem-s/ordem-s.page';


@Component({
  selector: 'app-popover-manuais',
  templateUrl: './popover-manuais.component.html',
  styleUrls: ['./popover-manuais.component.scss'],
})
export class PopoverManuaisComponent  implements OnInit {

  constructor(
    private modalCtrl:ModalController,
    private popoverCtrl: PopoverController,
  ) { }

  ngOnInit() {

  }
  acaoBotao1() {
    this.popoverCtrl.dismiss();
    this.modalCtrl.create({ component: OrdemSPage }).then((modal) => modal.present());
  }
  acaoBotao2() {
    this.popoverCtrl.dismiss();
    this.modalCtrl.create({ component: AllordemPage }).then((modal) => modal.present());
  }
}
