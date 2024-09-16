import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArvorepecaPageRoutingModule } from './arvorepeca-routing.module';

import { ArvorepecaPage } from './arvorepeca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ArvorepecaPageRoutingModule
  ],
  declarations: [ArvorepecaPage]
})
export class ArvorepecaPageModule {}
