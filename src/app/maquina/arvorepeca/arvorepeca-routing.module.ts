import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArvorepecaPage } from './arvorepeca.page';

const routes: Routes = [
  {
    path: '',
    component: ArvorepecaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArvorepecaPageRoutingModule {}
