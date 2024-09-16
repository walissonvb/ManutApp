import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdemSPageRoutingModule } from './ordem-s-routing.module';

import { OrdemSPage } from './ordem-s.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OrdemSPageRoutingModule
  ],
  declarations: [OrdemSPage]
})
export class OrdemSPageModule {}
