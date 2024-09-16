import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllordemPageRoutingModule } from './allordem-routing.module';

import { AllordemPage } from './allordem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllordemPageRoutingModule
  ],
  declarations: [AllordemPage]
})
export class AllordemPageModule {}
