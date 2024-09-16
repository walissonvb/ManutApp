import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaginaPageRoutingModule } from './pagina-routing.module';

import { PaginaPage } from './pagina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaginaPageRoutingModule
  ],
  declarations: [PaginaPage]
})
export class PaginaPageModule {}
