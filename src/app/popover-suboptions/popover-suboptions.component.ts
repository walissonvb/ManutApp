import { Component} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../almoxarife/modal/modal.page';
import { PaginaPage } from '../almoxarife/pagina/pagina.page';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-suboptions',
  templateUrl: './popover-suboptions.component.html',
  styleUrls: ['./popover-suboptions.component.scss'],
})
export class PopoverSuboptionsComponent {

  constructor(
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
  ) {}


  acaoBotao5() { // Adicione esta função
    this.popoverCtrl.dismiss();
    this.modalCtrl.create({ component: ModalPage }).then((modal) => modal.present());
  }

  acaoBotao6() { // Adicione esta função
    this.popoverCtrl.dismiss();
    this.modalCtrl.create({ component: PaginaPage }).then((modal) => modal.present());
  }
}
