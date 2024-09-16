import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaPage } from './pagina.page';

const routes: Routes = [
  {
    path: '',
    component: PaginaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaginaPageRoutingModule {}
