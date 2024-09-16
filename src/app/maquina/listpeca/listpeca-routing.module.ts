import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListpecaPage } from './listpeca.page';

const routes: Routes = [
  {
    path: '',
    component: ListpecaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListpecaPageRoutingModule {}
