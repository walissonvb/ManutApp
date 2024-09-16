import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalformprevPage } from './modalformprev.page';

const routes: Routes = [
  {
    path: '',
    component: ModalformprevPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalformprevPageRoutingModule {}
