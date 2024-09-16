import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroprevePageRoutingModule } from './cadastropreve-routing.module';

import { CadastroprevePage } from './cadastropreve.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroprevePageRoutingModule
  ],
  declarations: [CadastroprevePage]
})
export class CadastroprevePageModule {}
