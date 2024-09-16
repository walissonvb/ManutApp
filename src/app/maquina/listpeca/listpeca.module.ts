import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListpecaPageRoutingModule } from './listpeca-routing.module';

import { ListpecaPage } from './listpeca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListpecaPageRoutingModule
  ],
  declarations: [ListpecaPage]
})
export class ListpecaPageModule {}
