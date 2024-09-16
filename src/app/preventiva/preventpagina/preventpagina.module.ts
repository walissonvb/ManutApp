import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreventpaginaPageRoutingModule } from './preventpagina-routing.module';

import { PreventpaginaPage } from './preventpagina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreventpaginaPageRoutingModule
  ],
  declarations: [PreventpaginaPage]
})
export class PreventpaginaPageModule {}
