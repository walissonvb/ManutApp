import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhatsonPageRoutingModule } from './whatson-routing.module';

import { WhatsonPage } from './whatson.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhatsonPageRoutingModule
  ],
  declarations: [WhatsonPage]
})
export class WhatsonPageModule {}
