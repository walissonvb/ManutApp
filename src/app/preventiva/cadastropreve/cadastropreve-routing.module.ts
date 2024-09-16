import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroprevePage } from './cadastropreve.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroprevePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroprevePageRoutingModule {}
