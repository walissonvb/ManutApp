import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdemSPage } from './ordem-s.page';

const routes: Routes = [
  {
    path: '',
    component: OrdemSPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdemSPageRoutingModule {}
