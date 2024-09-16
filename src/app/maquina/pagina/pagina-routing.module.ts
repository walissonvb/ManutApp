import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaPage01 } from './pagina.page';

const routes: Routes = [
  {
    path: '',
    component: PaginaPage01
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaginaPageRoutingModule {}
