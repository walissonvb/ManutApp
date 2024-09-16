import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreventpaginaPage } from './preventpagina.page';

const routes: Routes = [
  {
    path: '',
    component: PreventpaginaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreventpaginaPageRoutingModule {}
