import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreventmodalPageRoutingModule } from './preventmodal-routing.module';

import { PreventmodalPage } from './preventmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreventmodalPageRoutingModule
  ],
  declarations: [PreventmodalPage]
})
export class PreventmodalPageModule {}
