import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaginaPageRoutingModule } from './pagina-routing.module';

import { PaginaPage01 } from './pagina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaginaPageRoutingModule
  ],
  declarations: [PaginaPage01]
})
export class PaginaPageModule {}
