import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhatsonPage } from './whatson.page';

const routes: Routes = [
  {
    path: '',
    component: WhatsonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhatsonPageRoutingModule {}
